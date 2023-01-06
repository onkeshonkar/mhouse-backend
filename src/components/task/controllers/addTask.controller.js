const httpStatus = require("http-status");
const Joi = require("joi");
const mongoose = require("mongoose");
require("express-async-errors");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const TaskCron = require("../../../models/TaskCron.model");
const Task = require("../../../models/Task.model");
const logger = require("../../../utils/logger");

module.exports = async (req, res, next) => {
  const checklistSchema = Joi.object({
    subTask: Joi.string().required(),
    dueTime: Joi.string(),
  });

  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      title: Joi.string().required(),
      comment: Joi.string(),
      checkList: Joi.array().items(checklistSchema).min(1).required(),
      departments: Joi.array().items(Joi.string()).required().min(1),
      repeatType: Joi.string().valid("Daily", "Weekly", "Monthly"),
      weeklyDueDay: Joi.alternatives().conditional("repeatType", {
        is: "Weekly",
        then: Joi.string()
          .valid("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
          .required(),
        otherwise: Joi.any().presence("forbidden"),
      }),
      monthlyDueDate: Joi.alternatives().conditional("repeatType", {
        is: "Monthly",
        then: Joi.number().min(1).max(28).required(),
        otherwise: Joi.any().presence("forbidden"),
      }),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const {
    title,
    comment,
    checkList,
    departments,
    repeatType,
    monthlyDueDate,
    weeklyDueDay,
  } = req.body;

  if (!canAccess(req.user, " TASKS", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (repeatType) {
      await TaskCron.create(
        [
          {
            title,
            comment,
            checkList,
            departments,
            repeatType,
            monthlyDueDate,
            weeklyDueDay,
            createdBy: req.user.id,
            branch: branchId,
          },
        ],
        { session }
      );
    }

    let dueDate;
    if (!repeatType || repeatType === "Daily") {
      dueDate = dayjs().endOf("day").toDate();
    } else if (repeatType === "Weekly") {
      dueDate = dayjs().endOf("week").toDate();
    } else if (repeatType === "Monthly") {
      dueDate = dayjs().endOf("month").toDate();
    }

    await Task.insertMany(
      [
        ...departments.map((dep) => ({
          department: dep,
          title,
          comment,
          checkList,
          dueDate,
          createdBy: req.user.id,
          branch: branchId,
        })),
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(httpStatus.CREATED).send();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    logger.error(error);

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Task creation failed`,
      error
    );
  }
};
