const DailyLoginReward = require("../models/dailyLogin.model");
const Level = require("../models/level.model");
const Member = require("../models/member.model");
const jwt = require("jsonwebtoken");
const { createLevel } = require("./level.controller");
const redisClient = require("../utils/redisConnect");
const Referral = require("../models/referral.model");


// Function to generate a unique referral code
const generateUniqueReferralCode = async () => {
  let referralCode;
  let existingReferralCode;
  do {
    referralCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    existingReferralCode = await Member.findOne({ referralCode }).lean().exec();
  } while (existingReferralCode);
  return referralCode;
};

// Function to handle referral reward
const handleReferralReward = async (rbcode, newMember) => {
  if (!rbcode) return;

  const referredByUser = await Member.findOne({ referralCode: rbcode }).exec();
  if (!referredByUser) {
    throw new Error("Referral code incorrect");
  }

  referredByUser.wallet.coins += 2500;
  await referredByUser.save();

  // Create and save referral record
  const newReferral = new Referral({
    referrer: referredByUser._id,
    referee: newMember._id,
    reward: 5000,
    rewardClaimed: true,
    status: "completed"
  });

  await newReferral.save();
};

// Function to register or login member
const registerOrLoginMember = async (req, res) => {
  const { walletAddress, country, rbcode } = req.body;

  // Basic validation
  if (!walletAddress) {
    return res.status(400).json({ message: "Please provide a valid wallet address.", success: false });
  }

  try {
    // Check if the member already exists
    const existingMember = await Member.findOne({ userId: walletAddress }).lean().exec();

    if (existingMember) {
      const token = jwt.sign(
        { id: existingMember._id, userId: existingMember.userId },
        process.env.TOKEN_SECRET,
        { expiresIn: '30d' }
      );

      res.cookie("token", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: "Lax", 
        maxAge: 30 * 24 * 60 * 60 * 1000 
      });

      return res.status(200).json({ message: "Member logged in successfully.", success: true, token });
    }

    // Register a new member
    const referralCode = await generateUniqueReferralCode();
    var initialCoin = 2500;

    // Find the appropriate level based on initial coins
    const level = await Level.findOne({
      minimumPoints: { $lte: initialCoin },
      maximumPoints: { $gte: initialCoin }
    }).exec();

    if (!level) {
      return res.status(400).json({ message: "No suitable level found.", success: false });
    }

    initialCoin += level.reward

    const nextDay = new Date();
    nextDay.setHours(0, 0, 0, 0);

    const newMember = new Member({
      userId: walletAddress,
      referralCode,
      referredBy: rbcode ? (await Member.findOne({ referralCode: rbcode }).exec())._id : null,
      country: country.trim(),
      currentLevel: {
        levelId: level._id,
        levelNumber: level.levelNumber
      },
      levelCleared: [],
      dailyLoginStreak: 0,
      lastLoginDate: new Date(),
      currentDayRewardClaimed: false,
      nextDayRewardDate: nextDay,
      wallet: { coins: initialCoin },
      accountStatus: "Active",
      powerUps: {
        onTap: level.levelNumber,
        energy: level.powerUps.energy
      },
      energyLevel: null,
      tapLevel: null
    });

    await newMember.save();

    // Handle referral reward if applicable
    if (rbcode) {
      await handleReferralReward(rbcode, newMember);
    }

    const token = jwt.sign(
      { id: newMember._id, userId: newMember.userId },
      process.env.TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    res.cookie("token", token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: "Lax", 
      maxAge: 30 * 24 * 60 * 60 * 1000 
    });

    return res.status(201).json({ message: "Member registered and logged in successfully.", success: true, token });

  } catch (error) {
    console.error("Error in registration or login process:", error.message);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};


// check memeber with walletAddress is already registered or not
const checkWallet = async (req, res) => {
  const { walletAddress } = req.query;

  console.log("wallet address", walletAddress)

  // Basic validation
  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required.", success: false });
  }

  try {
    // Check if the wallet address exists in the database
    const existingMember = await Member.findOne({ userId: walletAddress }).lean().exec();

    if (existingMember) {
      return res.status(200).json({ isRegistered: true, message: "Wallet address is already registered.", success: true });
    } else {
      return res.status(200).json({ isRegistered: false, message: "Wallet address is not registered.", success: true });
    }
  } catch (error) {
    console.error("Error checking wallet registration:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};


// get current member details 
const fetchMember = async (req, res) => {
  try {
    const memberId = req.member._id;  
    const member = await Member.aggregate([
      { $match: { _id: memberId } },
      {
        $lookup: {
          from: "levels",
          localField: "currentLevel.levelId",
          foreignField: "_id",
          as: "currentLevelDetails"
        }
      },
      {
        $unwind: '$currentLevelDetails'
      },
      {
        $lookup: {
          from: 'energyboosts',
          localField: 'energyLevel',
          foreignField: '_id',
          as: 'energyLevelDetails'
        }
      },
      {
        $unwind: { path: '$energyLevelDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'multitapboosts',
          localField: 'tapLevel',
          foreignField: '_id',
          as: 'tapLevelDetails'
        }
      },
      {
        $unwind: { path: '$tapLevelDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          referralCode: 1,
          dailyLoginStreak: 1,
          lastLoginDate: 1,
          currentDayRewardClaimed: 1,
          nextDayRewardDate: 1,
          accountStatus: 1,
          dailyTaskProgress: 1,
          currentLevelDetails: 1,
          energyLevelDetails: 1,
          tapLevelDetails: 1,
          "wallet.coins": 1,
          "powerUps.onTap": 1,
          "powerUps.energy": 1,
          "powerUps.tapEnergy": 1,
        }
      }
    ]).exec();


    if (!member || member.length === 0) {
      return res.status(400).json({ message: "Member not found", success: false });
    }

    return res.status(200).json({
      message: "Current User fetched successfully",
      success: true,
      member
    });

  } catch (error) {
    console.error("Error while fetching the current member details:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}



// update the currentDay Reward
const updatecurrentDayRewardClaimed = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Find members where the next reward date matches today, 
    const members = await Member.find({
      nextDayRewardDate: { $lte: new Date() }
    });


    const updatePromises = members.map(async (member) => {
      if (member.currentDayRewardClaimed) {
        if (member.dailyLoginStreak < 10) {
          member.dailyLoginStreak += 1;
        } else {
          member.dailyLoginStreak = 1;
        }
      } else {
        // User missed today, reset streak
        member.dailyLoginStreak = 1;
      }

      // Reset reward claim status and set the next reward date to 12:00 AM of tomorrow
      member.currentDayRewardClaimed = false;
      await member.save();
    });

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Current day reward claimed status updated successfully." });
  } catch (error) {
    console.error("Error updating current day reward claimed status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const claimCurrentDayLoginReward = async (req, res) => {
  try {
    const memberId = req.member._id;
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found." });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if the reward has already been claimed for today
    if (member.currentDayRewardClaimed) {
      return res.status(400).json({ message: "Reward already claimed for today." });
    }

    // Check if the member is eligible to claim today's reward
    if (member.nextDayRewardDate.getTime() !== currentDate.getTime()) {
      return res.status(400).json({ message: "Not eligible to claim the reward today." });
    }

    // Update the daily login streak
    if (member.dailyLoginStreak < 10) {
      member.dailyLoginStreak += 1; // Increment streak
    } else {
      member.dailyLoginStreak = 1; // Reset streak to 1 if it reaches 10
    }

    // Retrieve the reward for the current streak day
    const dailyLoginReward = await DailyLoginReward.findOne({ day: member.dailyLoginStreak });

    if (!dailyLoginReward) {
      return res.status(404).json({ message: "Daily login reward not found." });
    }

    // Add reward value to the member's wallet
    if (!member.wallet) {
      member.wallet = { coins: 0 };
    }

    member.wallet.coins += dailyLoginReward.rewardValue;

    // Set the next reward date to tomorrow at 12:00 AM
    const nextRewardDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    nextRewardDate.setHours(0, 0, 0, 0);
    member.nextDayRewardDate = nextRewardDate;

    // Mark today's reward as claimed
    member.currentDayRewardClaimed = true;

    // Save the updated member information
    await member.save();

    res.status(200).json({ message: "Reward claimed successfully.", streakDay: member.dailyLoginStreak, rewardValue: dailyLoginReward.rewardValue });
  } catch (error) {
    console.error("Error claiming current day login reward:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchFriendList = async (req, res) => {
  try {
    const memberId = req.member._id;
    const friendList = await Referral.aggregate([
      { $match: { referrer: memberId } },
      {
        $lookup: {
          from: "members",
          localField: "referee",
          foreignField: "_id",
          as: "friendsDetails"
        }
      },
      {
        $unwind: '$friendsDetails'
      },
      {
        $lookup: {
          from: "levels",
          localField: "friendsDetails.currentLevel.levelId",
          foreignField: "_id",
          as: "levelDetails"
        }
      },
      {
        $unwind: {
          path: '$levelDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          reward: 1,
          _id: 1,
          "friendsDetails.referralCode": 1,
          "levelDetails.name": 1,
        }
      }
    ]);

    return res.status(200).json({ message: "Friend list fetched successfully", success: true, friendList });
  } catch (error) {
    console.log("Error while fetching the friend list", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


module.exports = {
  registerOrLoginMember,
  checkWallet,
  updatecurrentDayRewardClaimed,
  claimCurrentDayLoginReward,
  fetchMember,
  fetchFriendList
};
