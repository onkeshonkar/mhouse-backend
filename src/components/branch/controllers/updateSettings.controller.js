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

    body: Joi.object({
      timeFormat: Joi.string().valid("12 hr", "24 hr"),
      timeZone: Joi.string(),
      payrollType: Joi.string().valid("Weekly", "Fortnightly", "Monthly"),
      cashRegister: Joi.number(),
      safeDeposit: Joi.number(),
      closingAmount: Joi.number(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const {
    timeFormat,
    timeZone,
    payrollType,
    cashRegister,
    safeDeposit,
    closingAmount,
  } = req.body;

  const _branch = await Branch.findByIdAndUpdate(
    branchId,
    {
      timeFormat,
      timeZone,
      payrollType,
      cashRegister,
      safeDeposit,
      closingAmount,
    },
    { new: true }
  ).select({
    manager: 0,
    departments: 0,
    jobTitles: 0,
    roles: 0,
    notifications: 0,
  });

  return res.json({ branch: _branch });
};
