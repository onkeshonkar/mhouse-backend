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
      type: String, // stoer time only in HH:mm 24 hr format
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
    department: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "pending", "completed", "in-progress"],
      default: "open",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    completedBy: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(taskSchema, false);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
