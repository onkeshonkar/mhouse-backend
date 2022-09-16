const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Employee = require("../../../models/Employee.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      empId: Joi.string().custom(customValidators.objectId).required(),
    }),
    body: Joi.object({
      resume: Joi.binary(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, empId } = req.params;

  const _emp = await Employee.findById(empId).select({});

  if (
    !canAccess(req.user, "WORKFORCE", "edit") &&
    _emp.user.id.toString() !== req.user.id
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  // update resume

  return res.status(httpStatus.NO_CONTENT).send();
};
