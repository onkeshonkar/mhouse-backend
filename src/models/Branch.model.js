const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const branchSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    manager: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    isMainBranch: Boolean,
    address: String,
    bankName: String,
    bankAccount: String,
    currency: String,
    timeFormat: {
      type: String,
      enum: ["12 hr", "24 hr"],
      default: "12 hr",
    },
    timeZone: String,
    payrollType: {
      type: String,
      enum: ["Weekly", "Fortnightly", "Monthly"],
      default: "Weekly",
    },
    cashRegister: {
      type: Number,
      default: 0.0,
    },
    safeDeposit: {
      type: Number,
      default: 0.0,
    },
    closingAmount: {
      type: Number,
      default: 0.0,
    },
    departments: [String],
    jobTitles: [String],
    roles: [String],
    notifications: {
      type: Object,
      default: {
        "Tasks Assigned To You": ["email", "sms"],
        "New Transfer In Finance": ["email", "sms"],
        "Forecast Update": [],
        "Targets Update": [],
        "Update In Suppliers": [],
        "Items Received": ["email"],
        "Update Availability Of Employees": ["email"],
      },
    },
    restaurent: {
      type: ObjectId,
      ref: "Restaurent",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

branchSchema.index({ name: 1, restaurent: 1 }, { unique: true });

toJSON(branchSchema);

const Branch = mongoose.model("Branch", branchSchema);

module.exports = Branch;
