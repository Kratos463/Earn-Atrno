const { MultitapBoost, EnergyBoost } = require("../models/boost.model");
const Member = require("../models/member.model");


// for create multi tap booster level
const createMultiTapBoost = async (req, res) => {
    const { level, cost, tap } = req.body;

    try {
        const lastMultitapEntry = await MultitapBoost.findOne().sort({ createdAt: -1 }).exec();

        if (lastMultitapEntry && (level <= lastMultitapEntry.level || cost <= lastMultitapEntry.cost || !tap)) {
            return res.status(400).json({ message: "Level and cost must be greater than the last entry", success: false });
        }
        const newMultitap = new MultitapBoost({ level, cost, tap });
        await newMultitap.save();

        return res.status(200).json({ message: "Multitap booster created successfully", success: true });
    } catch (error) {
        console.error("Error while creating multitap booster:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

// for create energy booster level
const createEnergyBoost = async (req, res) => {
    const { level, cost, energy } = req.body;

    try {
        // Find the most recent EnergyBoost entry
        const lastEnergyBoostEntry = await EnergyBoost.findOne().sort({ createdAt: -1 }).exec();

        if (lastEnergyBoostEntry && (level <= lastEnergyBoostEntry.level || cost <= lastEnergyBoostEntry.cost || !energy)) {
            return res.status(400).json({ message: "Level and cost must be greater than the last entry", success: false });
        }

        const newEnergyBoost = new EnergyBoost({ level, cost, energy });
        await newEnergyBoost.save();

        return res.status(200).json({ message: "Energy boost created successfully", success: true });
    } catch (error) {
        console.error("Error while creating energy boost:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};



const deleteEnergyBoost = async (req, res) => {
    try {
        const { energyId } = req.params;

        // Attempt to find and delete the energy boost
        const energyBoost = await EnergyBoost.findByIdAndDelete(energyId);

        // Check if the energy boost was found and deleted
        if (!energyBoost) {
            return res.status(404).json({ message: "Energy boost not found", success: false });
        }

        return res.status(200).json({ message: "Energy boost deleted successfully", success: true });
    } catch (error) {
        console.error("Error while deleting energy boost:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


const deleteMultiTapBoost = async (req, res) => {
    try {
        const { multiTapId } = req.params;

        // Attempt to find and delete the energy boost
        const multiTapBoost = await MultitapBoost.findByIdAndDelete(multiTapId);

        // Check if the energy boost was found and deleted
        if (!multiTapBoost) {
            return res.status(404).json({ message: "Multi tap boost not found", success: false });
        }

        return res.status(200).json({ message: "Multi tap boost deleted successfully", success: true });
    } catch (error) {
        console.error("Error while deleting energy boost:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

const updateEnergyBoost = async (req, res) => {
    try {
        const { energyId } = req.params;
        const updateData = req.body;

        const energyBoost = await EnergyBoost.findByIdAndUpdate(
            energyId,
            { $set: updateData },
            { new: true }
        );

        if (!energyBoost) {
            return res.status(404).json({ message: "Energy boost not found", success: false });
        }

        return res.status(200).json({ message: "Energy boost updated successfully", energyBoost, success: true });
    } catch (error) {
        console.error("Error while updating energy boost:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


const updateMultitapBoost = async (req, res) => {
    try {
        const { multitapId } = req.params;
        const updateData = req.body;

        const multitapBoost = await MultitapBoost.findByIdAndUpdate(
            multitapId,
            { $set: updateData },
            { new: true }
        );

        if (!multitapBoost) {
            return res.status(404).json({ message: "Multitap boost not found", success: false });
        }

        return res.status(200).json({ message: "Multitap boost updated successfully", multitapBoost, success: true });
    } catch (error) {
        console.error("Error while updating multitap boost:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};


const getAllMultiTapBooster = async (req, res) => {
    try {
        const multiTaps = await MultitapBoost.find()
        if (multiTaps.length === 0) {
            return res.status(400).json({ message: "No multi tap booster found", success: true })
        }

        return res.status(200).json({ multiTaps, message: "Multitap boosters reterived successfully", success: true })
    } catch (error) {
        console.error("Error while getting multitap boost:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getAllEnergyBooster = async (req, res) => {
    try {
        const energyBoosts = await EnergyBoost.find()
        if (energyBoosts.length === 0) {
            return res.status(400).json({ message: "No energybooster found", success: true })
        }

        return res.status(200).json({ energyBoosts, message: "Energy boosters reterived successfully", success: true })
    } catch (error) {
        console.error("Error while getting energy boost:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getSingleEnergyBooster = async (req, res) => {
    const energyId = req?.member.energyLevel;

    try {
        const energyLevels = await EnergyBoost.find();

        const currentLevelIndex = energyLevels.findIndex(level => level._id.toString() === energyId.toString());
        const firstIndex = energyLevels[0]

        if (currentLevelIndex !== -1) {
            const nextLevel = energyLevels[currentLevelIndex + 1];
            return res.status(200).json({ success: true, message: "Energy Booster fetched", level: nextLevel });
        } else {
            // If the energyId does not exist, return the first energy level
            return res.status(200).json({ success: true, message: "Energy Booster fetched", level: firstIndex });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getSingleTapBooster = async (req, res) => {
    const energyId = req?.member.energyLevel;

    try {
        const energyLevels = await MultitapBoost.find();

        const currentLevelIndex = energyLevels.findIndex(level => level._id.toString() === energyId.toString());
        const firstIndex = energyLevels[0]

        if (currentLevelIndex !== -1) {
            const nextLevel = energyLevels[currentLevelIndex + 1] || energyLevels[0]; // Return next or first if it's the last level
            return res.status(200).json({ success: true, message: "Tap booster fetched", level: nextLevel });
        } else {
            // If the energyId does not exist, return the first energy level
            return res.status(200).json({ success: true, message: "Tap Booster fetched", level: firstIndex });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


const boostBooster = async (req, res, type) => {
    const { boosterId } = req.params;
    const member = req.member;

    if (!boosterId) {
        return res.status(400).json({ message: `${type} ID is required.`, success: false });
    }

    try {
        const BoosterModel = type === 'energy' ? EnergyBoost : MultitapBoost;

        // Find the booster by ID
        const booster = await BoosterModel.findById(boosterId);

        if (!booster) {
            return res.status(404).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} booster not found.`, success: false });
        }

        if (booster.cost > member.wallet.coins) {
            return res.status(400).json({ message: "Insufficient Coins", success: false });
        }

        // Deduct coins and update member's power-ups
        member.wallet.coins -= booster.cost;

        if (type === 'energy') {
            member.energyLevel = booster._id;
            member.powerUps.energy += booster.energy;
        } else if (type === 'tap') {
            member.tapLevel = booster._id;
            member.powerUps.OnTap += booster.tap;
        }

        await member.save();

        return res.status(200).json({
            message: `${type.charAt(0).toUpperCase() + type.slice(1)} level updated successfully.`,
            success: true
        });
    } catch (error) {
        console.error(`Error updating ${type} booster:`, error);
        return res.status(500).json({ message: `An error occurred while updating ${type} booster.`, error, success: false });
    }
};

// Boost energy booster
const boostEnergyBooster = async (req, res) => {
    return boostBooster(req, res, 'energy');
};

// Boost tap booster
const boostTapBooster = async (req, res) => {
    return boostBooster(req, res, 'tap');
};



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
