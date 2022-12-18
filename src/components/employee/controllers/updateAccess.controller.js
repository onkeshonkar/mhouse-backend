const httpStatus = require("http-status");
const Joi = require("joi");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const canAccess = require("../../../utils/canAccess");

const Employee = require("../../../models/Employee.model");
const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const accessSchema = Joi.object().pattern(
    Joi.string().valid(
      "TASKS",
      "SUPPLIER",
      "STOCKTAKE",
      "BUILD_CART",
      "CASH_REGISTER",
      "CLOSING_DAY",
      "SAFE_DEPOSIT",
      "FUND_TRANSFER",
      "SCHEDULE_SHIFT",
      "WORKFORCE",
      "CATERING_ORDERS",
      "OPERATIONS",
      "MENU",
      "NEWS_FEED",
      "SETTINGS"
    ),
    Joi.array().items("view", "edit", "add").unique().max(3)
  );
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      empId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      branch: Joi.string().custom(customValidators.objectId),
      department: Joi.string().trim(),
      roles: Joi.object({
        role: Joi.string().trim(),
        access: accessSchema,
      }),

      ip: Joi.string().ip(),
      mac: Joi.string().custom(customValidators.mac),
    }),
  };

  validateSchema(req, schema);

  const { branch, department, roles, ip, mac } = req.body;

  if (!canAccess(req.user, "WORKFORCE", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { empId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const employee = await Employee.findByIdAndUpdate(
      empId,
      { branch, department },
      { session, new: true }
    );

    const _user = await User.findByIdAndUpdate(
      employee.user,
      {
        ip,
        mac,
        branch,
        roles,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // send access update email to emp

    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message, error);
  }
};
