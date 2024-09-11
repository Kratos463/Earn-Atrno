const Level = require("../models/level.model");

const createLevel = async (req, res) => {
    try {
        const {
            name,
            character,
            maximumPoints,
            minimumPoints,
            levelNumber,
            onTap,
            energy,
            reward
        } = req.body;

        // Convert inputs to BigInt
        const maxPoints = Number(maximumPoints);
        const minPoints = Number(minimumPoints);
        const rewardBigInt = Number(reward);

        // Input validation
        if (!name || !character || maxPoints <= 0n || !levelNumber || !onTap || !energy || rewardBigInt <= 0) {
            return res.status(400).json({ message: "Please provide all required parameters.", success: false });
        }

        console.log('minimumPoints:', minPoints, 'maximumPoints:', maxPoints);
        console.log('Type of minimumPoints:', typeof minPoints, 'Type of maximumPoints:', typeof maxPoints);

        // Ensure that maximumPoints is greater than or equal to minimumPoints
        if (maxPoints <= minPoints) {
            return res.status(400).json({ message: "Maximum points must be greater than minimum points.", success: false });
        }

        // Check if the level with the same name or level number already exists
        const existingLevel = await Level.findOne({
            $or: [
                { name: name },
                { levelNumber: levelNumber }
            ]
        });

        if (existingLevel) {
            return res.status(400).json({ message: "Level with this name or level number already exists.", success: false });
        }

        // Create a new Level instance
        const newLevel = new Level({
            name: name,
            character: character,
            minimumPoints: minPoints,  
            maximumPoints: maxPoints, 
            totalAchievers: 0,
            levelNumber: levelNumber,  
            powerUps: {
                onTap: onTap, 
                energy: energy 
            },
            reward: rewardBigInt  
        });

        await newLevel.save();

        return res.status(201).json({ message: "Level created successfully.", success: true });

    } catch (error) {
        console.error("Error creating level:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};


const deleteLevel = async (req, res) => {
    try {
        const { id } = req.params;

        // Input validation
        if (!id) {
            return res.status(400).json({ message: "Level ID is required.", success: false });
        }

        // Delete the level
        const deletedLevel = await Level.findByIdAndDelete(id);

        if (!deletedLevel) {
            return res.status(404).json({ message: "Level not found.", success: false });
        }

        return res.status(200).json({ message: "Level deleted successfully.", success: true });

    } catch (error) {
        console.error("Error deleting level:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

const updateLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            character,
            maximumPoints,
            minimumPoints,
            levelNumber,
            onTap,
            energy,
            reward
        } = req.body;

        // Input validation
        if (!id) {
            return res.status(400).json({ message: "Level ID is required.", success: false });
        }

        if (maximumPoints !== null ||
            minimumPoints !== null ||
            levelNumber !== null ||
            onTap !== null ||
            energy !== null ||
            reward !== null) {
            return res.status(400).json({ message: "Numeric fields must have a valid number value.", success: false });
        }

        if (maximumPoints < minimumPoints) {
            return res.status(400).json({ message: "Maximum points must be greater than or equal to minimum points.", success: false });
        }

        // Check if a level with the same name or level number already exists (excluding the current level being updated)
        const existingLevel = await Level.findOne({
            $or: [
                { name: name, _id: { $ne: id } },
                { levelNumber: levelNumber, _id: { $ne: id } }
            ]
        });

        if (existingLevel) {
            return res.status(400).json({ message: "Level with this name or level number already exists.", success: false });
        }

        // Update the level
        const updatedLevel = await Level.findByIdAndUpdate(id, {
            name,
            character,
            minimumPoints,
            maximumPoints,
            levelNumber,
            powerUps: {
                onTap,
                energy
            },
            reward
        }, { new: true });

        if (!updatedLevel) {
            return res.status(404).json({ message: "Level not found.", success: false });
        }

        return res.status(200).json({ message: "Level updated successfully.", success: true, level: updatedLevel });

    } catch (error) {
        console.error("Error updating level:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

const getSingleLevel = async (req, res) => {
    try {
        const { currentMember } = req.query;
        const { lvl } = req.query;
        const page = parseInt(req.query.page) || 1; 
        const pageSize = parseInt(req.query.pageSize) || 10; 

        if (!lvl) {
            return res.status(400).json({ message: "Level number is required.", success: false });
        }

        const level = await Level.aggregate([
            { $match: { levelNumber: parseInt(lvl) } },
            {
                $lookup: {
                    from: 'members',
                    localField: '_id',
                    foreignField: 'currentLevel.levelId',
                    as: 'membersAtThisLevel'
                }
            },
            {
                $lookup: {
                    from: 'members',
                    let: { levelId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$currentLevel.levelId', '$$levelId'] } } },
                        { $project: { referralCode: 1, _id: 0 } },
                        { $limit: 50 }
                    ],
                    as: 'paginatedAchievers'
                }
            },
            {
                $addFields: {
                    memberCount: { $size: "$membersAtThisLevel" }
                }
            },
            {
                $addFields: {
                    paginatedAchievers: {
                        $slice: [
                            "$paginatedAchievers",
                            (page - 1) * pageSize, 
                            pageSize 
                        ]
                    }
                }
            },
            {
                $addFields: {
                    currentMemberPosition: {
                        $indexOfArray: [
                            "$paginatedAchievers",
                            {
                                $arrayElemAt: [
                                    "$paginatedAchievers",
                                    {
                                        $indexOfArray: [
                                            "$paginatedAchievers",
                                            { referralCode: currentMember }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            { $project: { membersAtThisLevel: 0, achievers: 0 } }
        ]);

        if (!level || level.length === 0) {
            return res.status(404).json({ message: "Level not found.", success: false });
        }

        const paginatedLevel = level[0];
        const currentMemberPosition = paginatedLevel.currentMemberPosition !== -1 ? paginatedLevel.currentMemberPosition + 1 : null;

        return res.status(200).json({
            message: "Level retrieved successfully.",
            success: true,
            level: {
                ...paginatedLevel,
                currentMemberPosition
            }
        });

    } catch (error) {
        console.error("Error getting single level:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};





const getAllLevels = async (req, res) => {
    try {
        const levels = await Level.aggregate([
            {
                $lookup: {
                    from: 'members', 
                    localField: '_id',
                    foreignField: 'level',
                    as: 'membersAtThisLevel'
                }
            },
            {
                $addFields: {
                    memberCount: { $size: "$membersAtThisLevel" }
                }
            },
            { $project: { membersAtThisLevel: 0 } },
            { $sort: { levelNumber: 1 } }
        ]);

        if (!levels || levels.length === 0) {
            return res.status(404).json({ message: "No levels found.", success: false });
        }

        return res.status(200).json({ message: "Levels retrieved successfully.", success: true, levels });

    } catch (error) {
        console.error("Error getting levels:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};




module.exports = { createLevel, deleteLevel, updateLevel, getSingleLevel, getAllLevels };
