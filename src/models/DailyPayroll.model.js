const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const dailyPayrollSchema = mongoose.Schema(
  {
    workingHours: {
      type: String,
      required: true,
    },
    payRollRate: {
      type: Number,
      required: true,
    },
    payrollDate: {
      type: Date,
      required: true,
    },
    employee: {
      type: ObjectId,
      ref: "Employee",
      required: true,
    },
    branch: {
      type: Object,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(dailyPayrollSchema, false);

const DailyPayroll = mongoose.model("DailyPayroll", dailyPayrollSchema);

module.exports = DailyPayroll;
