const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const otpSchema = mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  usedAt: {
    type: Date,
    default: null,
  },
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

toJSON(otpSchema);

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;
