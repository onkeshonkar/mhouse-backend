require("express-async-errors");
const Joi = require("joi");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidator = require("../../../utils/customValidator");

const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {};

  validateSchema(req, schema);

  const user = await User.findById(req.user.id).populate({
    path: "branch",
    select: { deleted: 0, departments: 0, jobTitles: 0, roles: 0 },
  });

  res.json({ user });
};
