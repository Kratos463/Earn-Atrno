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

const boostMemberEnergy = async (req, res) => {
    const memberId = req.member._id;

    try {
        const member = await Member.findById(memberId).populate('energyLevel').exec();

        if (!member) {
            return res.status(404).json({ message: "Member not found", success: false });
        }

        let nextEnergyBoost;
        if (!member.energyLevel) {
            // If no energy boost applied, get level 1 boost
            nextEnergyBoost = await EnergyBoost.findOne({ level: 1 });
            if (!nextEnergyBoost) {
                return res.status(400).json({ message: "No boost available for level 1", success: false });
            }
        } else {
            // Get next boost level if already boosted
            const currentLevel = member.energyLevel.level;
            nextEnergyBoost = await EnergyBoost.findOne({ level: currentLevel + 1 });
            if (!nextEnergyBoost) {
                return res.status(400).json({ message: "Maximum boost level reached", success: false });
            }
        }

        if (nextEnergyBoost.cost > member.wallet.coin) {
            return res.status(400).json({ message: "Insufficient balance", success: false });
        }

        member.wallet.coins -= nextEnergyBoost.cost;
        member.energyLevel = nextEnergyBoost._id;
        member.powerUps.energy += nextEnergyBoost.energy;

        await member.save();

        return res.status(200).json({ message: "Energy boost applied successfully", success: true });

    } catch (error) {
        console.error("Error while boosting member energy:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

const boostMemberMultiTap = async (req, res) => {
    const memberId = req.member._id;

    try {
        // Find member and populate tapLevel in a single query
        const member = await Member.findById(memberId).populate('tapLevel').exec();

        if (!member) {
            return res.status(404).json({ message: "Member not found", success: false });
        }

        // Determine the next multitap boost level
        let nextMultiTapBoost;
        if (!member.tapLevel) {
            // If no multitap boost applied, get level 1 boost
            nextMultiTapBoost = await MultitapBoost.findOne({ level: 1 });
            if (!nextMultiTapBoost) {
                return res.status(400).json({ message: "No multitap boost available for level 1", success: false });
            }
        } else {
            // Get the next boost level based on the current level
            const currentLevel = member.tapLevel.level;
            nextMultiTapBoost = await MultitapBoost.findOne({ level: currentLevel + 1 });
            if (!nextMultiTapBoost) {
                return res.status(400).json({ message: "Maximum boost level reached", success: false });
            }
        }

        // Check if the member has enough coins
        if (nextMultiTapBoost.cost > member.wallet.coin) {
            return res.status(400).json({ message: "Insufficient balance", success: false });
        }

        // Deduct the cost from the member's wallet and apply the boost
        member.wallet.coins -= nextMultiTapBoost.cost;
        member.tapLevel = nextMultiTapBoost._id;
        member.powerUps.onTap += nextMultiTapBoost.tap;

        // Save the updated member details
        await member.save();

        return res.status(200).json({ message: "Multi-tap boost applied successfully", success: true });

    } catch (error) {
        console.error("Error while boosting member multitap:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
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

        return res.status(200).json({ message: "Energy boost updated successfully",energyBoost, success: true });
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

        return res.status(200).json({ message: "Multitap boost updated successfully",multitapBoost, success: true });
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


module.exports = {
    createMultiTapBoost,
    createEnergyBoost,
    boostMemberEnergy,
    boostMemberMultiTap,
    deleteEnergyBoost,
    deleteMultiTapBoost,
    updateEnergyBoost,
    updateMultitapBoost,
    getAllMultiTapBooster,
    getAllEnergyBooster
};
