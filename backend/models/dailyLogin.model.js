const { model, Schema } = require("mongoose");

const dailyLoginRewardSchema = new Schema({
    day: {
      type: Number,
      required: true,
    },
    rewardValue: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  }, { timestamps: true });
  
  const DailyLoginReward = model("DailyLoginReward", dailyLoginRewardSchema);
  module.exports = DailyLoginReward;
  