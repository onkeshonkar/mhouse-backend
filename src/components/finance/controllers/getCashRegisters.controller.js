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
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  if (!canAccess(req.user, "CASH_REGISTER", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const cashRegisters = await CashRegister.find({
    branch: branchId,
  }).populate("registeredBy", ["fullName", "avatar"]);

  res.json({ cashRegisters });
};
