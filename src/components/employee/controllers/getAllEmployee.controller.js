const httpStatus = require("http-status");
const Joi = require("joi");
const { ObjectId } = require("mongoose").Types;
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
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  if (!canAccess(req.user, "WORKFORCE", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const employees = await Employee.find({
    branch: new ObjectId(branchId),
  })
    .select({
      visa: 0,
      workSlot: 0,
      emergencyContact: 0,
      sickCertificates: 0,
      experience: 0,
      badges: 0,
      resume: 0,
    })
    .populate("payrollGroup", ["name"])
    .populate("user", [
      "fullName",
      "type",
      "roles",
      "email",
      "phoneNumber",
      "avatar",
      "dateOfBirth",
    ])
    .populate("branch", ["name"]);

  res.json({ employees });
};
