const { Schema, model } = require("mongoose");
const redisClient = require("../utils/redisConnect");

const memberSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true,
        index: true,
        unique: true
    },
    referralCode: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    referredBy: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },
    country: {
        type: String,
        trim: true
    },
    currentLevel: {
        levelId: {
            type: Schema.Types.ObjectId,
            ref: 'Level',
            required: true,
        },
        levelNumber: {
            type: Number,
            required: true
        }
    },
    levelCleared: [{
        levelId: {
            type: Schema.Types.ObjectId,
            ref: 'Level',
        },
        levelNumber: {
            type: Number,
            default: 0
        }
    }],
    dailyLoginStreak: {
        type: Number,
        default: 0,
    },
    lastLoginDate: {
        type: Date,
        default: null,
    },
    currentDayRewardClaimed: {
        type: Boolean,
        default: false,
    },
    nextDayRewardDate: {
        type: Date,
        required: true
    },
    wallet: {
        coins: {
            type: Number,
            default: 0,
        },
    },
    friendsList: [{
        type: Schema.Types.ObjectId,
        ref: 'Referral',
    }],
    dailyTaskProgress: [{
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'DailyTask',
        },
        completed: {
            type: Boolean,
            default: false,
        },
    }],
    energyLevel: {
        type: Schema.Types.ObjectId,
        ref: "EnergyBoost"
    },
    tapLevel: {
        type: Schema.Types.ObjectId,
        ref: "MultiTapBoost"
    },
    powerUps: {
        onTap: {
            type: Number,
            required: true,
            default: 1,
        },
        energy: {
            type: Number,
            required: true,
            default: 500,
        },
        tapEnergy: {
            type: Number,
            default: 500,
        }
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Banned'],
        default: 'Active',
    },
}, { timestamps: true });


// // Middleware to update cache after save
// memberSchema.post('save', async function (doc) {
//     const memberId = doc._id.toString();
//     await redisClient.setEx(`member:${memberId}`, 3600, JSON.stringify(doc));
//     console.log(`Cache updated for member: ${memberId}`);
// });

// // Middleware to update cache after findOneAndUpdate
// memberSchema.post('findOneAndUpdate', async function (doc) {
//     if (doc) {
//         const memberId = doc._id.toString();
//         await redisClient.setEx(`member:${memberId}`, 3600, JSON.stringify(doc));
//         console.log(`Cache updated for member: ${memberId}`);
//     }
// });

const Member = model("Member", memberSchema)

module.exports = Member