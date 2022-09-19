const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Budget = require("../../../models/Budget.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      allocatedAmount: Joi.number().required(),
      budgetDate: Joi.date().required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { budgetDate, allocatedAmount } = req.body;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const budget = await Budget.findOne({ branch: branchId, budgetDate });

  if (budget) {
    if (dayjs(budget.budgetDate).add(14, "days").isBefore(dayjs())) {
      // if budgetDate + 14days >= today --> updation allowed

      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cann't modify budget older than 2 weeks"
      );
    }

    budget.allocatedAmount = allocatedAmount;
    await budget.save();
    return res.status(httpStatus.CREATED).send();
  }

  await Budget.create({ branch: branchId, budgetDate, allocatedAmount });

  res.status(httpStatus.CREATED).send();
};
