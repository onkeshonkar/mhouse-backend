const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Employee = require("../../../models/Employee.model");
const { notifyAdmins } = require("../../../socketIO");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      empId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, empId } = req.params;

  if (!canAccess(req.user, "WORKFORCE", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const emp = await Employee.findByIdAndUpdate(empId, { deleted: true });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Workforce",
      message: `workforce is deleted ${emp.id}`,
    });
  }

  return res.status(httpStatus.NO_CONTENT).send();
};
