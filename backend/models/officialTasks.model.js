const { Schema, model } = require("mongoose");

const officialTaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        index: true,
        trim: true
    },
    platform: {
        type: String,
        required: true,
        index: true
    },
    icon: {
        type: String,
        trim: true,
        required: true
    },
    reward: {
        type: Number,
        required: true,
        default: 5000
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Expired'],
        default: 'Active',
    },
}, { timestamps: true });

const dailyTaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    platform: {
        type: String,
        enum: ['YouTube', 'Instagram', 'Facebook', 'Twitter'],
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    reward: {
        type: Number,
        required: true,
        default: 1000,
    },
    status: {
        type: String,
        enum: ['Upcoming', 'Expired'],
        default: 'Upcoming',
    },
    description: {
        type: String,
        trim: true,
    },
    expiryOn:{
        type: Date,
        required: true
    }
}, { timestamps: true });

const DailyTask = model("DailyTask", dailyTaskSchema);
const OfficialTask = model("OfficialTask", officialTaskSchema);

module.exports = {OfficialTask, DailyTask};
