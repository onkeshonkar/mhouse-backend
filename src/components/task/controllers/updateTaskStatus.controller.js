const httpStatus = require("http-status");
const Joi = require("joi");
const dayjs = require("dayjs");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Task = require("../../../models/Task.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      taskId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      subTaskId: Joi.string().custom(customValidators.objectId),
    }),
  };

  validateSchema(req, schema);

  const { branchId, taskId } = req.params;
  const { subTaskId } = req.body;

  const task = await Task.findById(taskId);

  if (dayjs().isAfter(task.dueDate)) {
    throw new ApiError(httpStatus.BAD_GATEWAY, "Task is expired");
  }

  console.log(task, req.user.id);
  if (task.completedBy && task.completedBy.toString() !== req.user.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Task is already in progress.");
  }

  if (!task.checkList.length) {
    task.status = "completed";
    task.completedBy = req.user.id;
    await task.save();

    return res(httpStatus.NO_CONTENT).send();
  }

  let completedAllTasks = true;
  let subTaskFound = false;
  task.checkList.map((subtask) => {
    //  make completedAllTasks only is subtask is not completed excepted the requested one
    if (!subtask.completed && subtask._id.toString() !== subTaskId) {
      completedAllTasks = false;
    }

    if (subtask._id.toString() === subTaskId) {
      subTaskFound = true;
      if (subtask.dueTime) {
        const subTaskExpired = dayjs(
          dayjs().format("YYYY/MM/DD").toString() + ` ${subtask.dueTime}`
        ).isBefore(dayjs());

        if (subTaskExpired) {
          throw new ApiError(httpStatus.BAD_REQUEST, "Subtask is expired");
        }
        subtask.completed = true;
        task.status = "in-progress";
      } else {
        subtask.completed = true;
        task.status = "in-progress";
      }
    }
  });

  if (completedAllTasks) {
    task.status = "completed";
    task.completedDate = dayjs().toDate();
  }

  task.completedBy = req.user.id;
  await task.save();

  res.status(httpStatus.NO_CONTENT).send();
};
