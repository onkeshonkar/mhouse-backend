const { required } = require("joi");
const mongoose = require("mongoose");

const toJSON = require("../utils/toJSON");

const { ObjectId } = mongoose.Types;

const rolesSchema = mongoose.Schema(
  {
    role: {
      type: String,
      // required: true,
      //   enum: ["Owner", "Manager", "Staff"],
    },
    access: {
      type: Object,
      default: {
        TASKS: ["view"],
        SUPPLIER: [],
        STOCKTAKE: [],
        BUILD_CART: [],
        CASH_REGISTER: [],
        CLOSING_DAY: [],
        SAFE_DEPOSIT: [],
        FUND_TRANSFER: [],
        SCHEDULE_SHIFT: ["view"],
        WORKFORCE: [],
        CATERING_ORDERS: ["view"],
        OPERATIONS: [],
        MENU: ["view"],
        NEWS_FEED: ["view"], // only view and add
        SETTINGS: ["view"], // only view and edit
      },
    },
  },

  { _id: false }
);

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: Date,
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    ip: String,
    mac: String,
    pin: String,
    type: {
      type: String,
      enum: ["OWNER", "MANAGER"],
    },
    roles: {
      type: rolesSchema,
      required: true,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
    },
  },
  { timestamps: true }
);

toJSON(userSchema, "password");

const User = mongoose.model("User", userSchema);

module.exports = User;
