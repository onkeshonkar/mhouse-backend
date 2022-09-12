const httpStatus = require("http-status");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");

const customValidator = require("../../../utils/customValidator");
const validateSchema = require("../../../utils/validateSchema");

const tokenService = require("../../../services/token.service");
const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      token: Joi.string().required(),
      newPassword: Joi.string().custom(customValidator.password).required(),
    }),
  };

  validateSchema(req, schema);

  const { token, newPassword } = req.body;

  const { valid, expired, resetPasswordToken } =
    await tokenService.validateResetPasswordToken(token);

  if (!valid || !resetPasswordToken) {
    next(new ApiError(httpStatus.BAD_REQUEST, "Invalid token"));
  }

  if (expired || resetPasswordToken.usedAt) {
    next(new ApiError(httpStatus.BAD_REQUEST, "Token expired"));
  }

  const user = await User.findById(resetPasswordToken.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid token");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  resetPasswordToken.usedAt = new Date();
  await resetPasswordToken.save();

  res.send();
};
