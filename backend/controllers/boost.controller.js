const { MultitapBoost, EnergyBoost } = require("../models/boost.model");
const Member = require("../models/member.model");

// Utility function for creating a boost (common for both multitap and energy boost)
const createBoost = async (req, res, BoostModel, type) => {
    const { level, cost, tap, energy } = req.body;

    try {
        const lastEntry = await BoostModel.findOne().sort({ createdAt: -1 }).exec();

        // Validation based on last entry's level and cost
        if (lastEntry && (level <= lastEntry.level || cost <= lastEntry.cost || (!tap && !energy))) {
            return res.status(400).json({ message: "Level and cost must be greater than the last entry", success: false });
        }

        // Create a new boost object
        const newBoost = new BoostModel({ level, cost, tap, energy });
        await newBoost.save();

        return res.status(200).json({ message: `${type} boost created successfully`, success: true, boosts: newBoost });
    } catch (error) {
        console.error(`Error while creating ${type} boost:`, error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

// Create Multitap Booster Level
const createMultiTapBoost = (req, res) => createBoost(req, res, MultitapBoost, 'Multitap');

// Create Energy Booster Level
const createEnergyBoost = (req, res) => createBoost(req, res, EnergyBoost, 'Energy');

// Utility function for deleting a boost (common for both multitap and energy boost)
const deleteBoost = async (req, res, BoostModel, type, idParam) => {
    try {
        const boostId = req.params[idParam];
        const boost = await BoostModel.findByIdAndDelete(boostId);

        if (!boost) {
            return res.status(404).json({ message: `${type} boost not found`, success: false });
        }

        return res.status(200).json({ message: `${type} boost deleted successfully`, success: true });
    } catch (error) {
        console.error(`Error while deleting ${type} boost:`, error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Delete Multitap Boost
const deleteMultiTapBoost = (req, res) => deleteBoost(req, res, MultitapBoost, 'Multitap', 'multiTapId');

// Delete Energy Boost
const deleteEnergyBoost = (req, res) => deleteBoost(req, res, EnergyBoost, 'Energy', 'energyId');

// Utility function for updating a boost (common for both multitap and energy boost)
const updateBoost = async (req, res, BoostModel, type, idParam) => {
    try {
        const boostId = req.params[idParam];
        const updateData = req.body;

        const boost = await BoostModel.findByIdAndUpdate(boostId, { $set: updateData }, { new: true });

        if (!boost) {
            return res.status(404).json({ message: `${type} boost not found`, success: false });
        }

        return res.status(200).json({ message: `${type} boost updated successfully`, boost, success: true });
    } catch (error) {
        console.error(`Error while updating ${type} boost:`, error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Update Multitap Boost
const updateMultitapBoost = (req, res) => updateBoost(req, res, MultitapBoost, 'Multitap', 'multitapId');

// Update Energy Boost
const updateEnergyBoost = (req, res) => updateBoost(req, res, EnergyBoost, 'Energy', 'energyId');

// Get all boosters (common for both multitap and energy boost)
const getAllBoosts = async (req, res, BoostModel, type) => {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    try {
        const skips = (page - 1) * limit; // Calculate how many documents to skip

        const boosts = await BoostModel.find()
            .skip(skips)
            .limit(limit);

        const totalBoosts = await BoostModel.countDocuments(); // Get the total count of documents

        if (boosts.length === 0) {
            return res.status(400).json({ message: `No ${type} boosters found`, success: false });
        }

        const totalPages = Math.ceil(totalBoosts / limit); // Calculate total pages

        return res.status(200).json({
            boosts,
            message: `${type} boosters retrieved successfully`,
            success: true,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalBoosts,
            }
        });
    } catch (error) {
        console.error(`Error while getting ${type} boosts:`, error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get all Multitap Boosters
const getAllMultiTapBooster = (req, res) => getAllBoosts(req, res, MultitapBoost, 'Multitap');

// Get all Energy Boosters
const getAllEnergyBooster = (req, res) => getAllBoosts(req, res, EnergyBoost, 'Energy');

// Get single booster based on member's level
const getSingleBooster = async (req, res, BoostModel, memberLevel, type) => {
    try {
        const levels = await BoostModel.find();
        const currentLevelIndex = levels.findIndex(level => level._id.toString() === memberLevel.toString());
        const firstLevel = levels[0];

        if (currentLevelIndex !== -1) {
            const nextLevel = levels[currentLevelIndex + 1] || levels[0];
            return res.status(200).json({ success: true, message: `${type} booster fetched`, level: nextLevel });
        }
    } catch (error) {
        console.error(`Error fetching ${type} booster:`, error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get Single Energy Booster
const getSingleEnergyBooster = (req, res) => getSingleBooster(req, res, EnergyBoost, req?.member.energyLevel, 'Energy');

// Get Single Tap Booster
const getSingleTapBooster = (req, res) => getSingleBooster(req, res, MultitapBoost, req?.member.tapLevel, 'Tap');

// Boost a booster (for both energy and multitap)
const boostBooster = async (req, res, type, BoostModel) => {
    const { boosterId } = req.params;
    const member = req.member;

    if (!boosterId) {
        return res.status(400).json({ message: `${type} ID is required.`, success: false });
    }

    try {
        // Perform a single query to get both the current booster and the next booster
        const boosters = await BoostModel.find({
            $or: [
                { _id: boosterId },
                { level: { $gte: 1 } }
            ]
        });

        // Extract the current and next booster from the results
        const currentBooster = boosters.find(booster => booster._id.toString() === boosterId);
        const nextBooster = boosters.find(booster => booster.level === currentBooster.level + 1);

        if (!currentBooster) {
            return res.status(404).json({ message: `${type} booster not found.`, success: false });
        }

        if (currentBooster.cost > member.wallet.coins) {
            return res.status(400).json({ message: "Insufficient Coins", success: false });
        }

        // Deduct coins and update member's power-ups
        member.wallet.coins -= currentBooster.cost;

        if (type === 'energy') {
            member.energyLevel = nextBooster ? nextBooster._id : currentBooster._id;
            member.powerUps.energy += currentBooster.energy;
        } else {
            member.tapLevel = nextBooster ? nextBooster._id : currentBooster._id;
            member.powerUps.onTap += currentBooster.tap;
        }

        // Save the updated member data
        await member.save();

        return res.status(200).json({
            message: `${type} level updated successfully.`,
            nextBoosterAvailable: !!nextBooster,
            success: true
        });
    } catch (error) {
        console.error(`Error updating ${type} booster:`, error);
        return res.status(500).json({ message: `An error occurred while updating ${type} booster.`, success: false });
    }
};


// Boost Energy Booster
const boostEnergyBooster = (req, res) => boostBooster(req, res, 'energy', EnergyBoost);

// Boost Tap Booster
const boostTapBooster = (req, res) => boostBooster(req, res, 'tap', MultitapBoost);

module.exports = {
    createMultiTapBoost,
    createEnergyBoost,
    deleteEnergyBoost,
    deleteMultiTapBoost,
    updateEnergyBoost,
    updateMultitapBoost,
    getAllMultiTapBooster,
    getAllEnergyBooster,
    getSingleEnergyBooster,
    getSingleTapBooster,
    boostEnergyBooster,
    boostTapBooster
};
