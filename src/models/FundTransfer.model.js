const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const fundTransferSchema = mongoose.Schema(
  {
    depositor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    method: {
      type: String,
      enum: ["CASH_ON_HAND", "BANK_DEPOSIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Canceled", "Approved"],
      default: "Pending",
      required: true,
    },
    comment: String,
    branch: {
      type: ObjectId,
      ref: "branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(fundTransferSchema, false);

const FundTransfer = mongoose.model("FundTransfer", fundTransferSchema);

module.exports = FundTransfer;
