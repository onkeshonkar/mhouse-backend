const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const closingDaySchema = mongoose.Schema(
  {
    cash: {
      type: Number,
      default: 0,
    },
    eftpos: {
      type: Number,
      default: 0,
    },
    deliveroo: {
      type: Number,
      default: 0,
    },
    uber: {
      type: Number,
      default: 0,
    },
    menulog: {
      type: Number,
      default: 0,
    },
    doorDash: {
      type: Number,
      default: 0,
    },
    orderUp: {
      type: Number,
      default: 0,
    },
    pos: {
      type: Number,
      default: 0,
    },
    note: String,
    totalIncome: {
      type: Number,
      required: true,
    },
    missingPos: {
      type: Number,
      derfault: 0,
    },
    transactionCount: {
      type: Number,
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

toJSON(closingDaySchema, false);

const closingDay = mongoose.model("closingDay", closingDaySchema);

module.exports = closingDay;
