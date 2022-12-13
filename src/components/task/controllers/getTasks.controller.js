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
    }),
    // query: Joi.object({ limitSize: Joi.string(), skipSize: Joi.string() }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  // const { limitSize, skipSize } = req.params;

  const tasks = await Task.find({ branch: branchId })
    .populate("completedBy", ["fullName", "email"])
    .sort({ createdAt: -1 });

  res.send({ tasks });
};
