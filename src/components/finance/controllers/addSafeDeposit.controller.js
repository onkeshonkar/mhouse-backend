const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const SafeDeposit = require("../../../models/SafeDeposit.model");
const { notifyAdmins } = require("../../../socketIO");

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
      comment: Joi.string(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  if (!canAccess(req.user, "SAFE_DEPOSIT", "add")) {
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
    comment,
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

  if (_totlaAmount <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect notes/coins count");
  }

  const safe = await SafeDeposit.create({
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
    comment,
    totalAmount: _totlaAmount,
    registeredBy: req.user.id,
    branch: branchId,
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Finance",
      message: `Amount $ ${_totlaAmount} is added in safe ${safe.id}`,
    });
  }

  res.status(httpStatus.CREATED).send();
};
