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
    }),

    body: Joi.object({
      name: Joi.string().trim().required(),
      weekdayRate: Joi.number().required(),
      publicHolidayRate: Joi.number().required(),
      saturdayRate: Joi.number().required(),
      sundayRate: Joi.number().required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { name, weekdayRate, publicHolidayRate, saturdayRate, sundayRate } =
    req.body;

  const payrollGroup = await PayrollGroup.create({
    name,
    weekdayRate,
    publicHolidayRate,
    saturdayRate,
    sundayRate,
    branch: branchId,
  });

  res.status(httpStatus.CREATED).send({ payrollGroup });
};
