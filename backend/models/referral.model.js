const { model, Schema } = require("mongoose");

const referralSchema = new Schema({
  referrer: {
    type: Schema.Types.ObjectId,
    ref: "Member", 
    required: true,
  },
  referee: {
    type: Schema.Types.ObjectId,
    ref: "Member", 
    required: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
  reward: {
    type: Number,
    default: 0,
  },
  rewardClaimed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rewarded'],
    default: 'pending',
  },
}, { timestamps: true });

const Referral = model("Referral", referralSchema);
module.exports = Referral;
