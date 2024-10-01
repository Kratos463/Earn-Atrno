const {Schema, model} = require("mongoose")

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
    socialMediaType: {
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
    }

}, {timestamps: true})

const OfficialTask = model("OfficialTask", officialTaskSchema)

module.exports = OfficialTask