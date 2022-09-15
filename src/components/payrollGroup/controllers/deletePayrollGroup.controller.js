const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const PayrollGroup = require("../../../models/PayrollGroup.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      pgId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, pgId } = req.params;

  const payrollGroup = await PayrollGroup.findByIdAndRemove(pgId);

  res.status(httpStatus.NO_CONTENT).send();
};
