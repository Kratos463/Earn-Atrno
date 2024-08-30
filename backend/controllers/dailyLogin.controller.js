const DailyLoginReward = require("../models/dailyLogin.model");


// create a new daily login reward
const createDailyLoginReward = async (req, res) => {
    try {
        const { day, rewardValue, isActive } = req.body;

        // Validate input
        if (!day && !rewardValue && !isActive) {
            return res.status(400).json({ message: "Please provide all required parameters.", success: false });
        }

        if (day <= 0 || day > 10) {
            return res.status(400).json({ message: "Maximum day to create daily login reward is 10.", success: false });
        }

        if (rewardValue < 0) {
            return res.status(400).json({ message: "Reward value must be a non-negative number.", success: false });
        }

        // Check if the daily reward already exists
        const existingDay = await DailyLoginReward.findOne({ day });

        if (existingDay) {
            return res.status(400).json({ message: "Reward for this day already exists. Please provide a different day.", success: false });
        }

        // Create new daily login reward
        const newDailyReward = new DailyLoginReward({
            day,
            rewardValue,
            isActive
        });

        await newDailyReward.save();

        return res.status(201).json({ message: "Daily login reward created successfully.", success: true });

    } catch (error) {
        console.error("Error creating daily login reward:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};


// fetch single daily login reward
const getSingleDailyReward = async (req, res) => {
    try {
        const { id } = req.query;

        // Validate input
        if (!id) {
            return res.status(400).json({ message: "Please provide an id.", success: false });
        }

        // Find the daily login reward by id
        const dailyReward = await DailyLoginReward.findById(id);

        if (!dailyReward) {
            return res.status(404).json({ message: "Daily login reward not found.", success: false });
        }

        return res.status(200).json({ message: "Daily login reward retrieved successfully.", success: true, dailyReward });

    } catch (error) {
        console.error("Error retrieving daily login reward:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};


// fetch all the daily login Reward
const getAllDailyRewards = async (req, res) => {
    try {
        // Find all daily login rewards
        const dailyRewards = await DailyLoginReward.find().select("-createdAt -updatedAt");

        return res.status(200).json({
            message: "Daily login rewards retrieved successfully.",
            success: true,
            dailyRewards
        });

    } catch (error) {
        console.error("Error retrieving daily login rewards:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};


// update single daily login reward
const updateDailyLoginReward = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, rewardValue, isActive } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Please provide an id.", success: false });
        }

        // Find the daily login reward by id and update it
        const updatedReward = await DailyLoginReward.findByIdAndUpdate(
            id,
            { day, rewardValue, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedReward) {
            return res.status(404).json({ message: "Daily login reward not found.", success: false });
        }

        return res.status(200).json({
            message: "Daily login reward updated successfully.",
            success: true,
            updatedReward
        });

    } catch (error) {
        console.error("Error updating daily login reward:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};


// delete single daily login reward
const deleteDailyLoginReward = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Please provide an id.", success: false });
        }

        // Find and delete the daily login reward by id
        const deletedReward = await DailyLoginReward.findByIdAndDelete(id);

        if (!deletedReward) {
            return res.status(404).json({ message: "Daily login reward not found.", success: false });
        }

        return res.status(200).json({
            message: "Daily login reward deleted successfully.",
            success: true,
        });

    } catch (error) {
        console.error("Error deleting daily login reward:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};


module.exports = {
    createDailyLoginReward,
    getSingleDailyReward,
    getAllDailyRewards,
    updateDailyLoginReward,
    deleteDailyLoginReward
};
