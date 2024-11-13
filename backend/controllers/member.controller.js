const DailyLoginReward = require("../models/dailyLogin.model");
const Member = require("../models/member.model");


const fetchMember = async (req, res) => {
  try {
    const member = await Member.aggregate([
      { $match: { _id: req.member._id } },
      {
        $lookup: {
          from: "levels",
          localField: "currentLevel.levelId",
          foreignField: "_id",
          as: "currentLevelDetails"
        }
      },
      {
        $unwind: { path: '$currentLevelDetails', preserveNullAndEmptyArrays: true }
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
        $lookup: {
          from: 'levels',
          localField: 'nextUpcomingLevel.levelId',
          foreignField: '_id',
          as: 'nextUpcomingLevelDetails'
        }
      },
      {
        $unwind: { path: '$nextUpcomingLevelDetails', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'dailytasks',
          localField: 'dailyTaskProgress.taskId',
          foreignField: '_id',
          as: 'dailyTaskDetails'
        }
      },
      {
        $lookup: {
          from: 'officialtasks',
          localField: 'officialTask.taskId',
          foreignField: '_id',
          as: 'officialTaskDetails'
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          referralCode: 1,
          dailyLoginStreak: 1,
          lastLoginDate: 1,
          currentDayRewardClaimed: 1,
          nextDayRewardDate: 1,
          accountStatus: 1,
          currentLevelDetails: 1,
          energyLevelDetails: 1,
          tapLevelDetails: 1,
          "wallet.coins": 1,
          "powerUps.onTap": 1,
          "powerUps.energy": 1,
          "powerUps.tapEnergy": 1,
          "nextUpcomingLevelDetails.minimumPoints": 1,
          "nextUpcomingLevelDetails.maximumPoints": 1,
          officialTask: 1,
          dailyTaskProgress: 1
        }
      },
    ]).exec();

    // Check if the member was found
    if (!member || member.length === 0) {
      return res.status(404).json({ message: "Member not found", success: false });
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
};

const updatecurrentDayRewardClaimed = async (req, res) => {
  try {

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 

    const members = await Member.find();

    const updatePromises = members.map(async (member) => {
      if (member.currentDayRewardClaimed) {
        member.currentDayRewardClaimed = false;
      } else {
        member.dailyLoginStreak = 0;
      }

      member.nextDayRewardDate = new Date();
      await member.save();
    });

    // Wait for all member updates to complete
    await Promise.all(updatePromises);

    // If `res` is provided (Express route), send a success response
    if (res) {
      return res.status(200).json({ message: "Members' reward claimed statuses updated successfully." });
    } else {
      console.log("Members' reward claimed statuses updated successfully.");
    }
  } catch (error) {
    console.error("Error updating members' reward claimed statuses:", error);

    // If `res` is available (Express route), send a failure response
    if (res) {
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      throw error; // Re-throw the error to be handled by task scheduler if needed
    }
  }
};

const claimCurrentDayLoginReward = async (req, res) => {
  try {
    const member = req.member;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const nextRewardDate = new Date(member.nextDayRewardDate);
    nextRewardDate.setHours(0, 0, 0, 0); 

    if (member.currentDayRewardClaimed || nextRewardDate.getTime() !== currentDate.getTime()) {
      return res.status(400).json({
        message: member.currentDayRewardClaimed
          ? "Reward already claimed for today."
          : "Not eligible to claim the reward today.",
        success: false
      });
    }

    member.dailyLoginStreak = (member.dailyLoginStreak < 10)
      ? member.dailyLoginStreak + 1
      : 1;

    const dailyLoginReward = await DailyLoginReward.findOne({ day: member.dailyLoginStreak });
    if (!dailyLoginReward) {
      return res.status(404).json({ message: "Daily login reward not found.", success: false });
    }

    // Update member's wallet and next reward date
    member.wallet.coins = (member.wallet.coins || 0) + dailyLoginReward.rewardValue;
    member.nextDayRewardDate = new Date();
    member.currentDayRewardClaimed = true;

    // Save the updated member information
    await member.save();

    return res.status(200).json({
      message: "Reward claimed successfully.",
      success: true
    });
  } catch (error) {
    console.error("Error claiming current day login reward:", error);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const fetchFriendList = async (req, res) => {
  try {
    const friendList = await Member.aggregate([
      { $match: { referredBy: req.member._id } },
      {
        $lookup: {
          from: "levels",
          localField: "currentLevel.levelId",
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
          _id: 0,
          firstName: 1,
          "levelDetails.name": 1,
          "levelDetails.levelNumber": 1,
        }
      }
    ]);

    // Early return if no friends found
    if (friendList.length === 0) {
      return res.status(200).json({ message: "No friends found", success: true, friendList });
    }

    return res.status(200).json({ message: "Friend list fetched successfully", success: true, friendList });
  } catch (error) {
    console.error("Error while fetching the friend list:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const fetchMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const members = await Member.find()
      .select("_id userId referralCode referredBy accountStatus createdAt country wallet.coins")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalMembers = await Member.countDocuments();

    if (!members.length) {
      return res.status(400).json({ message: "No members found", success: false });
    }

    return res.status(200).json({
      message: "Members list fetched successfully",
      success: true,
      members,
      pagination: {
        totalPages: Math.ceil(totalMembers / limit),
        currentPage: Number(page),
        totalMembers,
      }
    });
  } catch (error) {
    console.error("Error while fetching members list", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  updatecurrentDayRewardClaimed,
  claimCurrentDayLoginReward,
  fetchMember,
  fetchFriendList,
  fetchMembers
};
