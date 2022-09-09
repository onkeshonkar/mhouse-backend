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

const taskSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    comment: String,
    checkList: [checklistSchema],
    assignedDepartment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Pending", "Completed", "InProgress"],
      default: "Open",
    },
    createdBy: {
      type: Object,
      ref: "User",
      required: true,
    },
    completedBy: {
      type: Object,
      ref: "User",
    },
    branch: {
      type: Object,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(taskSchema, false);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;