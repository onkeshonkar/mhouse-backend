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
      bankName: Joi.string(),
      bankAccount: Joi.string(),
      currency: Joi.string(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const { bankName, bankAccount, currency } = req.body;

  const _branch = await Branch.findByIdAndUpdate(
    branchId,
    {
      bankName,
      bankAccount,
      currency,
    },
    { new: true }
  ).select({
    departments: 0,
    jobTitles: 0,
    roles: 0,
    notifications: 0,
  });

  return res.json({ branch: _branch });
};
