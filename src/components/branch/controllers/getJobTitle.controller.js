const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const branch = await Branch.findById(branchId).select({
    jobTitles: 1,
    restaurent: 1,
  });

  const { restaurent } = req.user.branch;

  if (branch.restaurent.toString() !== restaurent.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN); // denying access if restaurent of user and requested branch don't match
  }

  if (
    req.user.type === "OWNER" ||
    (req.user.type === "MANAGER" && req.user.branch.id === branchId)
  ) {
    return res.json({ jobTitles: branch.jobTitles });
  }

  next(new ApiError(httpStatus.FORBIDDEN));
};
