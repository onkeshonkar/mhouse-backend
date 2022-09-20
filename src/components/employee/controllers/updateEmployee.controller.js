const httpStatus = require("http-status");
const Joi = require("joi");
const { ObjectId } = require("mongoose").Types;
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const canAccess = require("../../../utils/canAccess");

const Employee = require("../../../models/Employee.model");
const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const visaSchema = Joi.object({
    type: Joi.string()
      .valid(
        "Student Visa(20hrs limit)",
        "Student Visa(non restricted)",
        "Temporary Work Visa",
        "PR",
        "Citizen"
      )
      .required(),
    expiryDate: Joi.date().optional(),
  });

  const tenureSchema = Joi.object({
    period: Joi.string().valid("Day", "Month", "Year").required(),
    duration: Joi.number().required(),
  });

  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      empId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      fullName: Joi.string().trim(),
      dateOfBirth: Joi.date(),
      //   avatar:
      email: Joi.string().lowercase().email().trim(),
      phoneNumber: Joi.string().custom(customValidators.phoneNumber),
      gender: Joi.string().valid("Male", "Female", "Others"),

      branch: Joi.string().custom(customValidators.objectId),
      department: Joi.string().trim(),
      jobTitle: Joi.string().trim(),
      employementType: Joi.string().valid("FullTime", "PartTime", "Casual"),
      tenure: tenureSchema,

      visa: visaSchema,
      payrollGroup: Joi.string().custom(customValidators.objectId),

      workSlot: Joi.array()
        .items(
          Joi.array().items(Joi.string().custom(customValidators.time)).max(2)
        )
        .length(7)
        .custom(customValidators.workSlot)
        .required(),
    }),
  };

  validateSchema(req, schema);

  const {
    fullName,
    dateOfBirth,
    avatar,
    email,
    phoneNumber,
    branch,
    gender,
    department,
    jobTitle,
    employementType,
    tenure,
    visa,
    payrollGroup,
    workSlot,
  } = req.body;

  if (!canAccess(req.user, "WORKFORCE", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { empId } = req.params;

  const employee = await Employee.findByIdAndUpdate(empId, {
    gender,
    department,
    jobTitle,
    employementType,
    tenure,
    visa,
    payrollGroup,
    workSlot,
    branch,
  });

  const _user = await User.findByIdAndUpdate(employee.user, {
    fullName,
    dateOfBirth,
    avatar,
    email,
    phoneNumber,
    branch,
  });

  res.status(httpStatus.NO_CONTENT).send();
};
