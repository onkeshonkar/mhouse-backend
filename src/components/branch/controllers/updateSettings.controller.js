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
      timeFormat: Joi.string().valid("12 hr", "24 hr").required(),
      timeZone: Joi.string().required(),
      payrollType: Joi.string()
        .valid("Weekly", "Fortnightly", "Monthly")
        .required(),
      cashRegister: Joi.number(),
      safeDeposit: Joi.number(),
      closingAmount: Joi.number(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  if (
    req.user.type === "OWNER" ||
    (req.user.type === "MANAGER" && req.user.branch.id === branchId)
  ) {
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
      notification: 0,
    });

    return res.json({ branch: _branch });
  }

  next(new ApiError(httpStatus.FORBIDDEN));
};
