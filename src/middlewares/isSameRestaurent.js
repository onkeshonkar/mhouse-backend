const httpStatus = require("http-status");
const mongoose = require("mongoose");
require("express-async-errors");

const ApiError = require("../utils/ApiError");

const Branch = require("../models/Branch.model");

const isSameResturent = async (req, res, next) => {
  const { branchId } = req.params;

  if (!branchId || !mongoose.isValidObjectId(branchId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid branch id");
  }

  const {
    branch: { restaurent },
  } = req.user;

  const branch = await Branch.findById(branchId).select({
    restaurent: 1,
  });

  if (!branch) {
    throw new ApiError(httpStatus.NOT_FOUND, `${branchId} not found`);
  }

  // denying access if user's branch and requested branch's restaurent are different

  if (branch.restaurent.toString() !== restaurent.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  next();
};

module.exports = isSameResturent;
