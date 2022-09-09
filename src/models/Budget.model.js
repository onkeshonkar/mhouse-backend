const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const budgetSchema = mongoose.Schema(
  {
    allocatedAmount: {
      type: Number,
      required: true,
    },
    totalRosterTime: {
      type: Number,
      required: true,
    },
    budgetDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(budgetSchema, false);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
