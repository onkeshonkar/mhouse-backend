const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const budgetSchema = mongoose.Schema(
  {
    allocatedAmount: {
      type: Number,
      required: true,
    },
    totalTime: {
      type: Number,
      required: true,
      default: 0,
    },
    budgetDate: {
      type: Date,
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

toJSON(budgetSchema, false);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
