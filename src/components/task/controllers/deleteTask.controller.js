const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Task = require("../../../models/Task.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      taskId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, " TASKS", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId, taskId } = req.params;

  const tasks = await Task.findByIdAndDelete(taskId);

  res.status(httpStatus.NO_CONTENT).send();
};
