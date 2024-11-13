const fs = require('fs');
const path = require('path');
const { OfficialTask, DailyTask } = require("../models/officialTasks.model");

// Helper for deleting an icon file from the public/images folder
const deleteIconFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

// Add Official Task
const addOfficialTask = async (req, res) => {
    const { url, username, platform, title, reward } = req.body;

    // Check if an icon was uploaded
    if (!req.files || !req.files.icon) {
        return res.status(400).json({ error: "Please upload an icon", success: false });
    }

    const iconPath = req.files?.icon[0].path.replace(/\\/g, '/');

    // Validation: check if all required fields are provided
    if (!url || !username || !socialMediaType || !title || !reward) {
        return res.status(400).json({ error: "Please provide all required details", success: false });
    }

    try {
        // Check if a task with the same username already exists for this social media platform
        const existingOfficialTask = await OfficialTask.findOne({ username, socialMediaType });

        if (existingOfficialTask) {
            return res.status(400).json({ error: "Task already assigned for this social media platform", success: false });
        }

        // Create a new official task
        const newOfficialTask = new OfficialTask({
            title,
            url,
            username,
            platform,
            reward: parseInt(reward),
            icon: iconPath
        });

        // Save the new task
        await newOfficialTask.save();

        // Success response
        return res.status(200).json({ message: "Official Task created successfully", success: true });

    } catch (error) {
        console.error("Error while creating official task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Get All Official Tasks
const getAllOfficialTasks = async (req, res) => {
    try {
        const officialTasks = await OfficialTask.find();

        if (!officialTasks || officialTasks.length === 0) {
            return res.status(404).json({ error: "No official task found", success: false });
        }

        return res.status(200).json({ message: "Official tasks fetched successfully", success: true, officialTasks });

    } catch (error) {
        console.error("Error while fetching official tasks:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Update Official Task Data (without icon)
const updateOfficialTaskData = async (req, res) => {
    const { id } = req.params;
    const { url, username, platform, title, reward } = req.body;

    // Validation
    if (!url || !username || !platform || !title || !reward) {
        return res.status(400).json({ error: "Please provide all required details", success: false });
    }

    try {
        const updatedTask = await OfficialTask.findByIdAndUpdate(id, {
            url,
            username,
            platform,
            title,
            reward: parseInt(reward)
        }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ error: "Official task not found", success: false });
        }

        return res.status(200).json({ message: "Official task updated successfully", success: true, updatedTask });

    } catch (error) {
        console.error("Error while updating official task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Update Official Task Icon (only icon)
const updateOfficialTaskIcon = async (req, res) => {
    const { id } = req.params;

    if (!req.files || !req.files.icon) {
        return res.status(400).json({ error: "Please upload an icon", success: false });
    }

    const newIconPath = `/images/${req.files.icon[0].filename}`; // Storing in public/images

    try {
        const task = await OfficialTask.findById(id);

        if (!task) {
            return res.status(404).json({ error: "Official task not found", success: false });
        }

        // Delete old icon
        if (task.icon) {
            const oldIconPath = path.resolve(__dirname, '..', 'public', task.icon); // Resolve absolute path
            deleteIconFile(oldIconPath);
        }

        // Update task with new icon path
        task.icon = newIconPath;
        await task.save();

        return res.status(200).json({ message: "Official task icon updated successfully", success: true });

    } catch (error) {
        console.error("Error while updating official task icon:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

// Delete Official Task (and associated icon)
const deleteOfficialTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await OfficialTask.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({ error: "Official task not found", success: false });
        }

        // Delete the associated icon file
        if (task.icon) {
            const iconPath = path.resolve(__dirname, '..', 'public', task.icon); // Resolve absolute path
            deleteIconFile(iconPath);
        }

        return res.status(200).json({ message: "Official task deleted successfully", success: true });

    } catch (error) {
        console.error("Error while deleting official task:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};


const claimTaskReward = async (req, res, TaskModel, type) => {
    const { taskId } = req.params; 
    const member = req.member;

    if (!taskId) {
        return res.status(400).json({ message: "Please provide a valid task ID", success: false });
    }

    try {
        const task = await TaskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found", success: false });
        }

        const taskExists = member[type]?.some((taskProgress) => taskProgress.taskId.toString() === taskId);
        if (taskExists) {
            return res.status(400).json({ message: "Task already completed", success: false });
        }

        // Append task to dailyTaskProgress or officialTask based on type
        if (type === 'dailyTaskProgress') {
            member.dailyTaskProgress.push({
                taskId: task._id,
                completed: true,  
            });
        } else if (type === 'officialTask') {
            member.officialTask.push({
                taskId: task._id,
                completed: true, 
            });
        }

        member.wallet.coins += task.reward; 
        await member.save();

        return res.status(200).json({
            message: "Task reward claimed successfully.",
            success: true,
            taskId: task._id
        });

    } catch (error) {
        console.error("Error claiming task reward:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


const claimDailyTask = (req, res) => claimTaskReward(req, res, DailyTask, "dailyTaskProgress")
const claimOfficialTask = (req, res) => claimTaskReward(req, res, OfficialTask, "officialTask")

module.exports = {
    addOfficialTask,
    getAllOfficialTasks,
    updateOfficialTaskData,
    updateOfficialTaskIcon,
    deleteOfficialTask,
    claimDailyTask,
    claimOfficialTask
};
