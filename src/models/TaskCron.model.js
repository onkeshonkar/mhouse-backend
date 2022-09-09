const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const checklistSchema = mongoose.Schema(
  {
    subTask: {
      type: String,
      required: true,
    },
    dueTime: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const TaskCronSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comment: String,
    checkList: [checklistSchema],
    assignedDepartments: [String],
    repeateType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
    },
    monthlyDueDate: Date,
    weeklyDueDay: {
      type: String,
      enum: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
    },
    createdBy: {
      type: Object,
      ref: "User",
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

toJSON(TaskCronSchema, false);

const TaskCron = mongoose.model("TaskCron", TaskCronSchema);

module.exports = TaskCron;
