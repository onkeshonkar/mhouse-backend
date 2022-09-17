const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
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
    }),

    body: Joi.object({
      date: Joi.date().required(),
      type: Joi.string().valid("week", "day").required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const { date, type } = req.body;

  if (!canAccess(req.user, "SCHEDULE_SHIFT", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const weekStartDate = dayjs(date).day(0).toDate();
  const weekEndDate = dayjs(date).day(6).toDate();

  let dateFilter;
  if (type === "week") {
    dateFilter = { $gte: weekStartDate, $lte: weekEndDate };
  } else if (type === "day") {
    dateFilter = date;
  }

  const schedules = await Schedule.updateMany(
    {
      scheduledDate: dateFilter,
      branch: branchId,
    },
    { published: true },
    { new: true }
  );

  // send email to all employee

  res.send({ message: "Schedule published" });
};
