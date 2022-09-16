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
  };

  validateSchema(req, schema);

  const { branchId, empId } = req.params;

  const emp = await Employee.findById(empId)
    .populate("user", ["fullName", "dateOfBirth", "avatar"])
    .populate("branch", ["name"]);

  if (
    canAccess(req.user, "WORKFORCE", "view") ||
    req.user.id === emp.user.toString()
  ) {
    return res.json({ employee: emp });
  }

  next(
    new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    )
  );
};
