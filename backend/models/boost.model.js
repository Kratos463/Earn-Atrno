const { Schema, model } = require("mongoose")

const multitapBoostSchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    tap:{
        type: Number,
        required: true
    }
}, { timestamps: true })

const energyLimitBoostSchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    energy: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const MultitapBoost = model("MultiTapBoost", multitapBoostSchema)
const EnergyBoost = model("EnergyBoost", energyLimitBoostSchema)

module.exports = { MultitapBoost, EnergyBoost }