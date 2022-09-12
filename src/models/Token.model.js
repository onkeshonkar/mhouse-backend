const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
    },
    type: {
      type: String,
      enum: ["RESET_PASSWORD", "SIGNUP_INVITATION"],
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
