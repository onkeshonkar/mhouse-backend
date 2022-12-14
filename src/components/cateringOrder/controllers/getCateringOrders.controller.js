const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const CateringOrder = require("../../../models/CateringOrder.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),
    query: Joi.object({
      clientName: Joi.string().trim(),
      phoneNumber: Joi.string().custom(customValidators.phoneNumber),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "CATERING_ORDERS", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;
  const { clientName, phoneNumber } = req.query;

  if (clientName && phoneNumber) {
    const cateringOrders = await CateringOrder.find({
      branch: branchId,
      clientName,
      phoneNumber,
    });

    return res.send({ cateringOrders });
  }

  const cateringOrders = await CateringOrder.find({
    branch: branchId,
  })
    .populate("createdBy", ["fullName", "avatar"])
    .populate("updatedBy", ["fullName", "avatar"])
    .sort({ createdAt: -1 });

  res.send({ cateringOrders });
};
