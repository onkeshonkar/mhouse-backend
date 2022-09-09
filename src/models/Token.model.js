const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["RESET_PASSWORD", "INVITATION_LINK"],
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
