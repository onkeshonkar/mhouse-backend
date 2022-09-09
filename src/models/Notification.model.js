const mongoose = require("mongoose");

const toJSON = require("../utils/toJSON");

const { ObjectId } = mongoose.Types;

const notificationSchema = mongoose.Schema(
  {
    triggerdBy: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    body: {
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
        "Catering_orders",
        "Operations",
        "Menu",
      ],
    },
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(notificationSchema);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
