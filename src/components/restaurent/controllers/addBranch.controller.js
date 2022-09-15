const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      rId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      name: Joi.string().trim().required(),
      manager: Joi.string().custom(objectId).required(),
      address: Joi.string().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const { rId } = req.params;

  const { name, manager, address } = req.body;

  if (rId !== req.user.branch.restaurent.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  const branch = await Branch.create({
    name,
    manager,
    address,
    restaurent: rId,
  });

  res.status(httpStatus.CREATED).send({ branch });
};
