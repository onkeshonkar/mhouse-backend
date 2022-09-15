const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const payrollGroupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // hourlyRate: {
    //   type: Number,
    //   required: true,
    // },
    weekdayRate: {
      type: Number,
      required: true,
    },
    publicHolidayRate: {
      type: Number,
      required: true,
    },
    saturdayRate: {
      type: Number,
      required: true,
    },
    sundayRate: {
      type: Number,
      required: true,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
    // restaurent: {
    //   type: ObjectId,
    //   ref: "Restaurent",
    //   required: true,
    // },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

payrollGroupSchema.index({ name: 1, branch: 1 }, { unique: true });

toJSON(payrollGroupSchema);

const PayrollGroup = mongoose.model("PayrollGroup", payrollGroupSchema);

module.exports = PayrollGroup;
