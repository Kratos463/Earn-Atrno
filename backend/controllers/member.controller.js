const DailyLoginReward = require("../models/dailyLogin.model");
const Level = require("../models/level.model");
const Member = require("../models/member.model");
const jwt = require("jsonwebtoken");
const { createLevel } = require("./level.controller");

// login or register the user on the basic of wallet address
const registerOrLoginMember = async (req, res) => {
  const { walletAddress, country, rbcode } = req.body;

  // Basic validations
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

      res.cookie("authToken", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });

      return res.status(200).json({ message: "Member logged in successfully.", success: true, token: token });
    }

    // If member does not exist, register a new member

    // Generate a unique referral code
    const generateUniqueReferralCode = async () => {
      let referralCode;
      let existingReferralCode;
      do {
        referralCode = Math.floor(10000000 + Math.random() * 90000000).toString();
        existingReferralCode = await Member.findOne({ referralCode }).lean().exec();
      } while (existingReferralCode);
      return referralCode;
    };

    const referralCode = await generateUniqueReferralCode();

    var coin = 10;
    let ontap = 0
    let energy = 0

    if (rbcode) {
      const referredByUser = await Member.findOne({ referralCode: rbcode });

      if (!referredByUser) {
        return res.status(400).json({ message: "Referral code incorrect", success: false });
      }

      coin += 5000;
      referredByUser.wallet.coins += 5000;
      await referredByUser.save();
    }


    const level = await Level.findOne({
      $and: [
        { minimumPoints: { $lte: coin } },
        { maximumPoints: { $gte: coin } }
      ]
    });

    const nextDay = new Date(Date.now());
    nextDay.setHours(0, 0, 0, 0);


    ontap += level.levelNumber
    energy += level.powerUps.energy

    // Create and save the new member
    const newMember = new Member({
      userId: walletAddress,
      referralCode,
      referredBy: rbcode ? (await Member.findOne({ referralCode: rbcode }))._id : null,
      country: country.trim(),
      level: level._id,
      dailyLoginStreak: 0,
      lastLoginDate: new Date(Date.now()),
      currentDayRewardClaimed: false,
      nextDayRewardDate: nextDay,
      wallet: {
        coins: coin
      },
      accountStatus: "Active",
      powerUps: {
        onTap: ontap,
        energy: energy
      },
      energyLevel: null,
      tapLevel: null
    });

    await newMember.save();

    // Generate a JWT token for new registration
    const token = jwt.sign(
      { id: newMember._id, userId: newMember.userId },
      process.env.TOKEN_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie for authentication
    res.cookie("authToken", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: "Strict" });

    return res.status(201).json({ message: "Member registered and logged in successfully.", success: true, token: token });

  } catch (error) {
    console.error("Error in registration or login process:", error);
    return res.status(500).json({ message: "Internal server error.", success: false });
  }
};

// check memeber with walletAddress is already registered or not
const checkWallet = async (req, res) => {
  const { walletAddress } = req.query;

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



module.exports = { registerOrLoginMember, checkWallet, updatecurrentDayRewardClaimed, claimCurrentDayLoginReward };
