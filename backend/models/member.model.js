const { Schema, model } = require("mongoose")

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
    },
    country: {
        type: String,
        trim: true
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: 'Level',
        required: true,
    },
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
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Banned'],
        default: 'Active',
    },
}, { timestamps: true })

const Member = model("Member", memberSchema)

module.exports = Member