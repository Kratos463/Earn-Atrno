const DailyLoginReward = require("../models/dailyLogin.model");

// Helper functions
const handleError = (res, message, ) => {
    return res.status(400).json({ message, success: false });
};

const handleServerError = (res, error) => {
    console.error(error);
    return res.status(500).json({ message: "Internal server error.", success: false });
};

const validateDailyRewardInput = (day, rewardValue, res) => {
    if (!day && !rewardValue) {
        return handleError(res, "Please provide all required parameters.");
    }

    if (day <= 0 || day > 10) {
        return handleError(res, "Maximum day to create daily login reward is 10.");
    }

    if (rewardValue < 0) {
        return handleError(res, "Reward value must be a non-negative number.");
    }

    return null;
};

// Create a new daily login reward
const createDailyLoginReward = async (req, res) => {
    try {
        const { day, rewardValue } = req.body;

        // Validate input
        const validationError = validateDailyRewardInput(day, rewardValue, res);
        if (validationError) return validationError;

        // Check if the daily reward already exists
        const existingDay = await DailyLoginReward.findOne({ day });
        if (existingDay) return handleError(res, "Reward for this day already exists. Please provide a different day.");

        // Create new daily login reward
        const newDailyReward = new DailyLoginReward({ day, rewardValue });
        await newDailyReward.save();

        return res.status(201).json({ message: "Daily login reward created successfully.", success: true, reward: newDailyReward });
    } catch (error) {
        return handleServerError(res, error);
    }
};

// Fetch single daily login reward
const getSingleDailyReward = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) return handleError(res, "Please provide an id.");

        const dailyReward = await DailyLoginReward.findById(id);
        if (!dailyReward) return handleError(res, "Daily login reward not found.");

        return res.status(200).json({ message: "Daily login reward retrieved successfully.", success: true, dailyReward });
    } catch (error) {
        return handleServerError(res, error);
    }
};

// Fetch all daily login rewards
const getAllDailyRewards = async (req, res) => {
    try {
        const dailyRewards = await DailyLoginReward.find().select("-createdAt -updatedAt");
        return res.status(200).json({ message: "Daily login rewards retrieved successfully.", success: true, dailyRewards });
    } catch (error) {
        return handleServerError(res, error);
    }
};

// Update single daily login reward
const updateDailyLoginReward = async (req, res) => {
    try {
        const { id } = req.params;
        const { day, rewardValue, isActive } = req.body;

        if (!id) return handleError(res, "Please provide an id.");

        const updatedReward = await DailyLoginReward.findByIdAndUpdate(
            id,
            { day, rewardValue, isActive },
            { new: true, runValidators: true }
        );

        if (!updatedReward) return handleError(res, "Daily login reward not found.");

        return res.status(200).json({ message: "Daily login reward updated successfully.", success: true, updatedReward });
    } catch (error) {
        return handleServerError(res, error);
    }
};

// Delete single daily login reward
const deleteDailyLoginReward = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return handleError(res, "Please provide an id.");

        const deletedReward = await DailyLoginReward.findByIdAndDelete(id);
        if (!deletedReward) return handleError(res, "Daily login reward not found.");

        return res.status(200).json({ message: "Daily login reward deleted successfully.", success: true });
    } catch (error) {
        return handleServerError(res, error);
    }
};

module.exports = {
    createDailyLoginReward,
    getSingleDailyReward,
    getAllDailyRewards,
    updateDailyLoginReward,
    deleteDailyLoginReward
};
