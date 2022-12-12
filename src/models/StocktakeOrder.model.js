const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const orderItemSchema = mongoose.Schema(
  {
    stocktakeId: {
      type: ObjectId,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const stocktakeOrderSchema = mongoose.Schema(
  {
    orderItems: {
      type: [orderItemSchema],
      required: true,
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
    orderValue: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Delivered", "Canceled"],
      default: "Open",
    },
    createdBy: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    updatedBy: {
      type: ObjectId,
      ref: "User",
      default: null,
    },
    supplier: {
      type: ObjectId,
      ref: "Supplier",
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

toJSON(stocktakeOrderSchema, false);

const StocktakeOrder = mongoose.model("StocktakeOrder", stocktakeOrderSchema);

module.exports = StocktakeOrder;
