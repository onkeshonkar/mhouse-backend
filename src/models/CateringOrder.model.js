const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const cartItemSchema = mongoose.Schema(
  {
    menu: {
      type: ObjectId,
      ref: "Menu",
      required: true,
    },
    dish: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const cateringOrderSchema = mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    cart: {
      type: [cartItemSchema],
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },
    deliveryMethod: {
      type: String,
      enum: ["Delivery", "Pickup"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Delivered", "Canceled"],
      default: "Open",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Eftpos", "Credit"],
      required: true,
    },
    upfrontPayment: {
      type: Number,
      required: true,
      default: 0,
    },
    orderAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    updatedBy: {
      type: ObjectId,
      ref: "User",
    },
    notes: {
      type: String,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

cateringOrderSchema.index({ clientName: 1, phoneNumber: 1 });

toJSON(cateringOrderSchema, false);

const CateringOrder = mongoose.model("CateringOrder", cateringOrderSchema);

module.exports = CateringOrder;
