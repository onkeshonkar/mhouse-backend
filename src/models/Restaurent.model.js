const mongoose = require("mongoose");

const toJSON = require("../utils/toJSON");

const { ObjectId } = mongoose.Types;

const restaurentSchema = mongoose.Schema(
  {
    venueName: {
      //  venue name will be the branch name for main branch
      type: String,
      required: true,
    },
    businessName: String, //  eg. abc.pvt ltd.
    address: String, // main branch address
    owner: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    payrollId: {
      type: Number,
      default: 0,
    },
    employeeId: {
      type: Number,
      default: 0,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

toJSON(restaurentSchema);

const Restaurent = mongoose.model("Restaurent", restaurentSchema);

module.exports = Restaurent;
