const mongoose = require("mongoose");

const toJSON = require("../utils/toJSON");

const { ObjectId } = mongoose.Types;

const emergencyContactSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const experienceSchema = mongoose.Schema(
  {
    logo: { type: String },
    companyName: { type: String },
    department: { type: String },
    jobTitle: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { _id: false }
);

const visaSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Student Visa(20hrs limit)",
        "Student Visa(non restricted)",
        "Temporary Work Visa",
        "PR",
        "Citizen",
      ],
    },
    expiryDate: Date,
  },
  { _id: false }
);

const leavesSchema = mongoose.Schema(
  {
    consumed: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
  },
  { _id: false }
);

const employeeSchema = mongoose.Schema(
  {
    employeeId: {
      type: Number,
      required: true,
    },
    payrollId: {
      type: Number,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: true,
    },
    fullAddress: { type: String, required: true },
    department: { type: String, required: true },
    jobTitle: { type: String, required: true },
    employementType: {
      type: String,
      enum: ["FullTime", "PartTime", "Casual"],
      default: "FullTime",
    },
    tenure: {
      period: {
        type: String,
        enum: ["Day", "Month", "Year"],
      },
      duration: Number,
    },
    visa: visaSchema,
    payrollGroup: {
      type: ObjectId,
      ref: "PayrollGroup",
      required: true,
    },
    workSlot: [[String, String]],
    sickLeave: { type: leavesSchema, default: () => ({}) },
    annualLeave: { type: leavesSchema, default: () => ({}) },
    emergencyContact: { type: emergencyContactSchema, required: true },
    experience: experienceSchema,
    resume: String,
    sickCertificates: [String],
    badges: [String],
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

toJSON(employeeSchema, false);
const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
