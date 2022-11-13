const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const supplierSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    portalURL: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    officePhone: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    orderVia: {
      type: String,
      enum: ["Email", "SMS", "Portal", "Link Via SMS"],
      required: true,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    purchaseValue: {
      type: Number,
      default: 0,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    deliveryInstruction: {
      type: String,
      default: "",
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(supplierSchema);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
