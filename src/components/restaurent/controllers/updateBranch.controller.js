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
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      name: Joi.string().trim(),
      manager: Joi.string().custom(customValidators.objectId),
      address: Joi.string().trim(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, rId } = req.params;

  const { name, manager, address } = req.body;

  const branch = await Branch.findByIdAndUpdate(branchId, {
    name,
    manager,
    address,
  });

  res.send({ branch });
};
