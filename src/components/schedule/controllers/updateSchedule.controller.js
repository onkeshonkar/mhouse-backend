const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const mongoose = require("mongoose");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Schedule = require("../../../models/Schedule.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      scheduleId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      scheduledSlot: Joi.array().items(Joi.string()).length(2),
      breakTime: Joi.number(),
      leaveType: Joi.string().valid(
        "Unpaid Leave",
        "Annual Leave",
        "Sick Leave"
      ),
    })
      .xor("scheduledSlot", "leaveType")
      .with("scheduledSlot", "breakTime"),
  };

  validateSchema(req, schema);

  const { branchId, scheduleId } = req.params;

  const { scheduledSlot, breakTime, leaveType } = req.body;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const schedule = await Schedule.findById(scheduleId);

  if (dayjs(schedule.scheduledDate).add(14, "days").isBefore(dayjs())) {
    // if scheduledDate + 14days >= today --> deletion allowed

    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cann't modify schedule older than 2 weeks"
    );
  }

  if (leaveType) {
    schedule.scheduledSlot = [];
    schedule.breakTime = undefined;
    schedule.leaveType = leaveType;
  }

  if (scheduledSlot && scheduledSlot.length) {
    schedule.scheduledSlot = scheduledSlot;
    schedule.breakTime = breakTime;
    schedule.leaveType = undefined;
  }

  await schedule.save();

  res.status(httpStatus.NO_CONTENT).send();
};
