const { model, Schema } = require("mongoose");

// Assuming 'Member' model is already defined and imported
const levelSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true,
  },
  character: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  minimumPoints: {
    type: Number,
    required: true,
    default: 0,
  },
  maximumPoints: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: function (v) {
        return v >= this.minimumPoints;
      },
      message: props => `Maximum points (${props.value}) must be greater than or equal to minimum points (${this.minimumPoints})!`,
    },
  },
  achievers: [{
    type: Schema.Types.ObjectId,
    ref: 'Member', 
  }],
  totalAchievers: {
    type: Number,
    default: 0,
  },
  levelNumber: {
    type: Number,
    required: true,
    default: 0,
    index: true,
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
  },
  reward: {
    type: Number,
    required: true,
  },
}, { timestamps: true });


const Level = model("Level", levelSchema);
module.exports = Level;
