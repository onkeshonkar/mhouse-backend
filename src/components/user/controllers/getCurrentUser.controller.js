const httpStatus = require("http-status");
require("express-async-errors");
const Joi = require("joi");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidator = require("../../../utils/customValidator");

const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {};

  validateSchema(req, schema);

  const user = await User.findById(req.user.id).populate("branch");

  res.json({ user });
};
