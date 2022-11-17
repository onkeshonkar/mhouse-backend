const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const lastBuySchema = mongoose.Schema(
  { quantity: Number, date: Date },
  { _id: false }
);

const stocktakeSchema = mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
      unique: true,
    },
    unit: {
      type: String,
      enum: ["Kg", "Liter", "Box", "Piece", "Package"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    avgCostPrice: {
      type: Number,
      default: null,
    },
    minStock: {
      type: Number,
      required: true,
    },
    waste: {
      type: Number,
      default: 0,
    },
    lastBuy: {
      type: lastBuySchema,
      default: { quantity: null, date: null },
    },
    currentStock: {
      type: Number,
      default: 0,
    },
    branch: {
      type: ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  { timestamps: true }
);

toJSON(stocktakeSchema);

const Stocktake = mongoose.model("Stocktake", stocktakeSchema);

module.exports = Stocktake;
