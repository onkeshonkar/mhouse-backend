const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Schedule = require("../../../models/Schedule.model");
const dayjs = require("dayjs");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      scheduledSlot: Joi.array().items(Joi.string()).length(2),
      breakTime: Joi.number(),
      scheduledDate: Joi.date().required(),
      leaveType: Joi.string().valid(
        "Unpaid Leave",
        "Annual Leave",
        "Sick Leave"
      ),
      employee: Joi.string().custom(customValidators.objectId).required(),
    })
      .with("scheduledSlot", "breakTime")
      .xor("scheduledSlot", "leaveType"),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { scheduledSlot, breakTime, scheduledDate, leaveType, employee } =
    req.body;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  if (dayjs(scheduledDate).add(14, "days").isBefore(dayjs())) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cann't add schedule older than 2weeks"
    );
  }

  try {
    const schedule = await Schedule.create({
      scheduledSlot,
      breakTime,
      scheduledDate,
      leaveType,
      employee,
      branch: branchId,
    });
    res.status(httpStatus.CREATED).send({ schedule });
  } catch (error) {
    throw next(
      new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Schedule already exists for employee ${employee} and date ${scheduledDate}`,
        error
      )
    );
  }
};
