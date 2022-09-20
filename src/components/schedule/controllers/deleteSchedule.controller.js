const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");
const timeDifference = require("../../../utils/timeDifference");

const Schedule = require("../../../models/Schedule.model");
const Budget = require("../../../models/Budget.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      scheduleId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, scheduleId } = req.params;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const schedule = await Schedule.findById(scheduleId);

  // if scheduledDate + 14days >= today --> deletion allowed

  if (dayjs(schedule.scheduledDate).add(14, "days").isBefore(dayjs())) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Cann't delete schedule older than 2 weeks"
    );
  }

  const oldTime = timeDifference(
    schedule?.scheduledSlot?.[0],
    schedule?.scheduledSlot?.[1]
  );

  if (oldTime) {
    await Budget.findOneAndUpdate(
      {
        branch: branchId,
        budgetDate: schedule.scheduledDate,
      },
      { $inc: { totalWorkMinute: -oldTime } }
    );
  }

  await schedule.delete();

  res.status(httpStatus.NO_CONTENT).send();
};
