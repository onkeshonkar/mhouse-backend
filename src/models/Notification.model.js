const mongoose = require("mongoose");

const toJSON = require("../utils/toJSON");

const { ObjectId } = mongoose.Types;

const notificationSchema = mongoose.Schema(
  {
    triggeredBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: [
        "Task",
        "Inventory",
        "Finance",
        "Schedule",
        "Workforce",
        "Catering",
        "Operations",
        "Menu",
      ],
    },
    triggeredFor: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

toJSON(notificationSchema, false);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
