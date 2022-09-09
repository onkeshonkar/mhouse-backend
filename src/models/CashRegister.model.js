const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const cashRegisterSchema = mongoose.Schema(
  {
    "5C": {
      type: Number,
      required: true,
      default: 0,
    },
    "10C": {
      type: Number,
      required: true,
      default: 0,
    },
    "20C": {
      type: Number,
      required: true,
      default: 0,
    },
    "50C": {
      type: Number,
      required: true,
      default: 0,
    },
    "1$": {
      type: Number,
      required: true,
      default: 0,
    },
    "2$": {
      type: Number,
      required: true,
      default: 0,
    },
    "5$": {
      type: Number,
      required: true,
      default: 0,
    },
    "10$": {
      type: Number,
      required: true,
      default: 0,
    },
    "20$": {
      type: Number,
      required: true,
      default: 0,
    },
    "50$": {
      type: Number,
      required: true,
      default: 0,
    },
    "100$": {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Night"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    registeredBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(cashRegisterSchema, false);

const CashRegister = mongoose.model("CashRegister", cashRegisterSchema);

module.exports = CashRegister;
