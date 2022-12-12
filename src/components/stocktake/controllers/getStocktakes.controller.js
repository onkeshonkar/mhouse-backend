const httpStatus = require("http-status");
const Joi = require("joi");
const { ObjectId } = require("mongoose").Types;

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Stocktake = require("../../../models/Stocktake.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),
    query: Joi.object({
      inStock: Joi.boolean(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "STOCKTAKE", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;
  const { inStock } = req.query;
  if (inStock) {
    const stocktake = await Stocktake.find({
      branch: branchId,
      currentStock: { $gt: 0 },
    });
    return res.send({ stocktake });
  }
  const stocktakes = await Stocktake.find({ branch: ObjectId(branchId) }).sort({
    createdAt: -1,
  });

  res.send({ stocktakes });
};
