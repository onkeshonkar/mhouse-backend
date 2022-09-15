const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const Restaurent = require("../../../models/Restaurent.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      rId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      businessName: Joi.string().trim().required(),
      address: Joi.string().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const { rId } = req.params;

  const { businessName, address } = req.body;

  if (rId !== req.user.branch.restaurent.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  const _rest = await Restaurent.findByIdAndUpdate(
    rId,
    { businessName, address },
    { new: true }
  );

  if (!_rest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Restaurent cann't be found");
  }

  res.status(httpStatus.NO_CONTENT).send();
};
