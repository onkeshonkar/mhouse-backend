const httpStatus = require("http-status");
const Joi = require("joi");
const { objectId } = require("mongoose").Types;
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const StocktakeOrder = require("../../../models/StocktakeOrder.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      supplierId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, supplierId } = req.params;

  if (!canAccess(req.user, "SUPPLIER", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const orders = await StocktakeOrder.find({
    supplier: Object(supplierId),
  })
    .populate("createdBy", ["fullName", "avatar", "email"])
    .populate("updatedBy", ["fullName", "avatar", "email"])
    .sort({ createdAt: -1 });

  res.send({ orders });
};
