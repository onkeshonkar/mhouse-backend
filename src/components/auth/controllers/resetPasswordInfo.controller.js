const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");

const User = require("../../../models/User.model");
const tokenService = require("../../../services/token.service");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      token: Joi.string().required(),
    }),
  };

  validateSchema(req, schema);

  const { token } = req.body;

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

  res.send({ user });
};
