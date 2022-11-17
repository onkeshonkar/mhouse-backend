const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const toJSON = require("../utils/toJSON");

const rawItemSchema = mongoose.Schema(
  {
    stocktake: {
      type: ObjectId,
      required: true,
      ref: "Stocktake",
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

const menuSchema = mongoose.Schema(
  {
    dish: {
      type: String,
      required: true,
    },
    rawItems: {
      type: [rawItemSchema],
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
    prepareTime: {
      type: String,
      required: true,
    },
    rawMaterialCost: {
      type: Number,
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    sellCount: {
      type: Number,
      default: 0,
      required: true,
    },
    nutriScore: {
      type: String,
      enum: ["A", "B", "C", "D", "E"],
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

toJSON(menuSchema);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
