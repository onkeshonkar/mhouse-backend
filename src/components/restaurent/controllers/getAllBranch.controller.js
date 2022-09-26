const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const { ObjectId } = require("mongoose").Types;

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      rId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { rId } = req.params;

  if (rId !== req.user.restaurent.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  const branches = await Branch.find({ restaurent: new ObjectId(rId) }).select({
    name: 1,
    manager: 1,
    isMainBranch: 1,
    restaurent: 1,
  });

  res.send({ branches });
};
