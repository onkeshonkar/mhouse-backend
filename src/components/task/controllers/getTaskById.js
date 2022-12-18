const httpStatus = require("http-status");
const Joi = require("joi");

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
  };

  validateSchema(req, schema);

  const { branchId, taskId } = req.params;
  // const { limitSize, skipSize } = req.params;

  const task = await Task.findById(taskId)
    .populate("completedBy", ["fullName", "avatar", "email"])
    .populate("createdBy", ["fullName", "avatar", "email"]);

  res.send({ task });
};
