const httpStatus = require("http-status");
const Joi = require("joi");

const { ObjectId } = require("mongoose").Types;

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Supplier = require("../../../models/Suppliers.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),
    query: Joi.object({
      basicsOnly: Joi.boolean(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { basicsOnly } = req.query;

  if (!canAccess(req.user, "SUPPLIER", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  let suppliers;

  if (basicsOnly) {
    suppliers = await Supplier.find({ branch: branchId }).select({
      name: 1,
      email: 1,
      avatar: 1,
    });

    return res.send({ suppliers });
  }

  suppliers = await Supplier.find({ branch: branchId });
  res.send({ suppliers });
};
