const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const announceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mediaURL: {
      type: String,
      required: true,
      default: "",
    },
    department: {
      type: String,
      required: true,
    },
    text: {
      type: String,
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

toJSON(announceSchema, false);

const Announcement = mongoose.model("Announcement", announceSchema);

module.exports = Announcement;
