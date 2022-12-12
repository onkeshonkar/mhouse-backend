const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");
const FundTransfer = require("../../../models/FundTransfer.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      method: Joi.string().valid("Cash on Hand", "Bank Deposit").required(),
      amount: Joi.number().min(1).required(),
      commnet: Joi.string(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, " FUND_TRANSFER", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;

  const { method, amount, commnet } = req.body;
  await FundTransfer.create({
    method,
    amount,
    depositor: req.user.id,
    commnet,
    branch: branchId,
  });

  res.status(httpStatus.CREATED).send();
};
