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

    body: Joi.object({
      name: Joi.string().trim(),
      weekdayRate: Joi.number(),
      publicHolidayRate: Joi.number(),
      saturdayRate: Joi.number(),
      sundayRate: Joi.number(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, pgId } = req.params;
  const { name, weekdayRate, publicHolidayRate, saturdayRate, sundayRate } =
    req.body;

  const payrollGroup = await PayrollGroup.findByIdAndUpdate(
    pgId,
    {
      name,
      weekdayRate,
      publicHolidayRate,
      saturdayRate,
      sundayRate,
      branch: branchId,
    },
    { new: true }
  );

  res.status(httpStatus.CREATED).send({ payrollGroup });
};
