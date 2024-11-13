const { DailyTask } = require('../models/officialTasks.model');

// Create a new daily task
const createDailyTask = async (req, res) => {


    const { title, url, platform, username, reward, expiryOn, description } = req.body;

    // Ensure required fields are provided
    if (!title || !url || !platform || !username || !reward || !expiryOn) {
        return res.status(400).json({ error: "Please provide all required details", success: false });
    }

    try {
        const existingTask = await DailyTask.findOne({ url });

        if (existingTask) {
            return res.status(400).json({ error: "Task already assigned for this url", success: false });
        }

        const newDailyTask = new DailyTask({
            title,
            url,
            platform,
            username,
            reward: parseInt(reward),
            description: description ? description : "",
            expiryOn,
        });

        await newDailyTask.save();

        return res.status(201).json({ message: "Daily Task created successfully", success: true, task: newDailyTask });

    } catch (error) {
        console.error("Error while creating daily task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Update a daily task
const updateDailyTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, url, platform, username, reward, expiryOn, description } = req.body;

    try {
        const updatedTask = await DailyTask.findByIdAndUpdate(
            taskId,
            { title, url, platform, username, reward, description, expiryOn },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found", success: false });
        }

        return res.status(200).json({ message: "Daily Task updated successfully", success: true, task: updatedTask });

    } catch (error) {
        console.error("Error while updating daily task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Get all daily tasks
const getAllDailyTasks = async (req, res) => {
    try {
        const tasks = await DailyTask.find();
        return res.status(200).json({ success: true, tasks, message: "Daily task fetched" });
    } catch (error) {
        console.error("Error while fetching daily tasks:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Get a single daily task
const getSingleDailyTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await DailyTask.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found", success: false });
        }

        return res.status(200).json({ success: true, task });
    } catch (error) {
        console.error("Error while fetching daily task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Delete a daily task
const deleteDailyTask = async (req, res) => {
    const { taskId } = req.params;

    try {
        const deletedTask = await DailyTask.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found", success: false });
        }

        return res.status(200).json({ message: "Daily Task deleted successfully", success: true });
    } catch (error) {
        console.error("Error while deleting daily task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

module.exports = {
    createDailyTask,
    updateDailyTask,
    getAllDailyTasks,
    getSingleDailyTask,
    deleteDailyTask,
};
