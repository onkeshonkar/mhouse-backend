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
  },
  { _id: false }
);

const TaskCronSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comment: String,
    checkList: [checklistSchema],
    departments: [String],
    repeatType: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
    },
    monthlyDueDate: Number,
    weeklyDueDay: {
      type: String,
      enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
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
