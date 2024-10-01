const OfficialTask = require("../models/officialTasks.model")

const addOfficialTask = async (req, res) => {
    const { url, username, socialMediaType, title, reward } = req.body;

    // Check if an icon was uploaded
    if (!req.files) {
        return res.status(400).json({ error: "Please upload an icon", success: false });
    }

    const iconPath = req.files?.icon[0].path.replace(/\\/g, '/');

    // Validation: check if all required fields are provided
    if (!url || !username || !socialMediaType || !title || !reward) {
        return res.status(400).json({ error: "Please provide valid details", success: false });
    }

    try {
        // Check if a task with the same username already exists for this social media platform
        const existingOfficialTask = await OfficialTask.findOne({ username });

        if (existingOfficialTask) {
            return res.status(400).json({ error: "Task already assigned for this social media platform", success: false });
        }

        // Create a new official task, including the icon path
        const newOfficialTask = new OfficialTask({
            title,
            url,
            username,
            socialMediaType,
            reward: parseInt(reward),
            icon: iconPath
        });

        // Save the new task
        await newOfficialTask.save();

        // Success response
        return res.status(200).json({ message: "Official Task created successfully", success: true });

    } catch (error) {
        console.error("Error while creating official task:", error);
        return res.status(500).json({ error: "Internal server error", success: false, error });
    }
};



const getAllOfficialTasks = async (req, res) => {
    try {
        const officialTasks = await OfficialTask.find()

        if(!officialTasks){
            return res.status(400).json({error: "No official task found", success: false})
        }

        return res.status(200).json({message: "Official tasks fetched successfully", success: true, officialTasks})

    } catch (error) {
        console.log("Error while fetching official tasks", error)
        return res.status(500).json({error: "Internal server error", success: false})
    }
}




module.exports = {addOfficialTask, getAllOfficialTasks}