const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const { branchId } = req.params;

  const branch = await Branch.findById(branchId).select({
    departments: 1,
    restaurent: 1,
  });

  if (
    req.user.type === "OWNER" ||
    (req.user.type === "MANAGER" && req.user.branch.id === branchId)
  ) {
    return res.json({ departments: branch.departments });
  }

  next(new ApiError(httpStatus.FORBIDDEN));
};
