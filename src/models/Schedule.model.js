const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const actualWorkingTimeSchema = mongoose.Schema(
  {
    time: [String, String],
    reason: String,
    approved: Boolean, // when manger update in case crew worked lesser/longer than scheduled slot.
  },
  { _id: false }
);

const scheduleSchema = mongoose.Schema(
  {
    scheduledSlot: [String, String],
    breakTime: { type: Number }, // it's in minutes
    actualWokingTime: actualWorkingTimeSchema, // calculated at 11:59pm check-in/out data
    leaveType: {
      type: String,
      enum: ["Unpaid Leave", "Annual Leave", "Sick Leave"],
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    employee: {
      type: ObjectId,
      ref: "Employee",
      required: true,
    },
    inDraft: {
      type: Boolean,
      default: true, // false means published and employee can see
    },
    branch: {
      type: Object,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(scheduleSchema, false);

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;
