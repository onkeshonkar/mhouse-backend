require("express-async-errors");
const Joi = require("joi");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidator = require("../../../utils/customValidator");
const { ObjectId } = require("mongoose").Types;

const User = require("../../../models/User.model");
const Employee = require("../../../models/Employee.model");

module.exports = async (req, res, next) => {
  const schema = {};

  validateSchema(req, schema);

  const user = await User.findById(req.user.id).populate({
    path: "branch",
    select: { deleted: 0, departments: 0, jobTitles: 0, roles: 0 },
  });

  const employee = await Employee.findOne({
    user: ObjectId(user.id),
  }).select({
    department: 1,
  });

  res.json({
    user: {
      ...user.toJSON(),
      employeeId: employee.id,
      department: employee.department,
    },
  });
};
