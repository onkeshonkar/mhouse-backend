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
      email: Joi.string().lowercase().email().trim(),
      phoneNumber: Joi.string().custom(customValidators.phoneNumber),
      fullAddress: Joi.string(),
      emergencyContact: Joi.object({
        fullName: Joi.string().trim().required(),
        phoneNumber: Joi.string().custom(customValidators.phoneNumber).trim(),
        relation: Joi.string().trim(),
      }),
    }),
  };

  validateSchema(req, schema);

  const { branchId, empId } = req.params;

  const { email, phoneNumber, fullAddress, emergencyContact } = req.body;

  if (!canAccess(req.user, "WORKFORCE", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  await Employee.findByIdAndUpdate(empId, {
    email,
    phoneNumber,
    fullAddress,
    emergencyContact,
  });

  return res.status(httpStatus.NO_CONTENT).send();
};
