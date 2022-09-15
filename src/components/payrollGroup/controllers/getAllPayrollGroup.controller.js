const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const { ObjectId } = require("mongoose").Types;

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const PayrollGroup = require("../../../models/PayrollGroup.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const payrollGroups = await PayrollGroup.find({
    branch: new ObjectId(branchId),
  });

  res.status(httpStatus.CREATED).send({ payrollGroups });
};
