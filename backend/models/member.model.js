const { Schema, model } = require("mongoose");

const memberSchema = new Schema({
    telegramId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    firstName: {
        type: String,
        trim: true,
        index: true,
    },
    lastName: {
        type: String,
        trim: true
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
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
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
    nextUpcomingLevel: {
        levelId: {
            type: Schema.Types.ObjectId,
            ref: 'Level',
        },
        levelNumber: {
            type: Number,
            required: true,
        },
    },
    officialTask: [{
        taskId: {
            type: Schema.Types.ObjectId,
            ref: 'OfficialTask',
        },
        completed: {
            type: Boolean,
            default: false,
        },
    }],
}, { timestamps: true });

const Member = model("Member", memberSchema);

module.exports = Member;
