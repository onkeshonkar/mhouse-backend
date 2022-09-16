const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const closingDay = require("../../../models/ClosingDay.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      transactionCount: Joi.number().required(),
      totalIncome: Joi.number().required(),
      note: Joi.string(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { transactionCount, totalIncome, note } = req.body;

  if (!canAccess(req.user, "CLOSING_DAY", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  await closingDay.create({
    transactionCount,
    totalIncome,
    note,
    registeredBy: req.user.id,
    branch: branchId,
  });

  res.status(httpStatus.CREATED).send();
};
