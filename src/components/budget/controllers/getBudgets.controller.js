const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const dayjs = require("dayjs");
const { ObjectId } = require("mongoose").Types;

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

    query: Joi.object({ date: Joi.date().required() }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const { date } = req.query;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const weekStartDate = dayjs(date).day(0).toDate();
  const weekEndDate = dayjs(date).day(6).toDate();

  const budgets = await Budget.find({
    branch: ObjectId(branchId),
    budgetDate: { $gte: weekStartDate, $lte: weekEndDate },
  });

  res.json({ budgets });
};
