const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const CashRegister = require("../../../models/CashRegister.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      "5C": Joi.number().required(),
      "10C": Joi.number().required(),
      "20C": Joi.number().required(),
      "50C": Joi.number().required(),
      "1$": Joi.number().required(),
      "2$": Joi.number().required(),
      "5$": Joi.number().required(),
      "10$": Joi.number().required(),
      "20$": Joi.number().required(),
      "50$": Joi.number().required(),
      "100$": Joi.number().required(),
      time: Joi.string()
        .valid("Breakfast", "Lunch", "Dinner", "Night")
        .required(),
      totalAmount: Joi.number().required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  if (!canAccess(req.user, "CASH_REGISTER", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const {
    "5C": cent5,
    "10C": cent10,
    "20C": cent20,
    "50C": cent50,
    "1$": $1,
    "2$": $2,
    "5$": $5,
    "10$": $10,
    "20$": $20,
    "50$": $50,
    "100$": $100,
    time,
    totalAmount,
  } = req.body;

  const _totlaAmount =
    0.05 * cent5 +
    0.1 * cent10 +
    0.2 * cent20 +
    0.5 * cent50 +
    1 * $1 +
    2 * $2 +
    5 * $5 +
    10 * $10 +
    20 * $20 +
    50 * $50 +
    100 * $100;

  await CashRegister.create({
    "5C": cent5,
    "10C": cent10,
    "20C": cent20,
    "50C": cent50,
    "1$": $1,
    "2$": $2,
    "5$": $5,
    "10$": $10,
    "20$": $20,
    "50$": $50,
    "100$": $100,
    time,
    totalAmount: _totlaAmount,
    registeredBy: req.user.id,
    branch: branchId,
  });

  res.status(httpStatus.CREATED).send();
};
