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
      password: Joi.string().custom(customValidator.password).required(),
      pin: Joi.string().custom(customValidator.pin).required(),
    }),
  };

  validateSchema(req, schema);

  const { token, password, pin } = req.body;

  const { valid, expired, invitationToken } =
    await tokenService.validateInvitationToken(token);

  if (!valid || !invitationToken) {
    next(new ApiError(httpStatus.BAD_REQUEST, "Invalid token"));
  }

  if (expired || invitationToken.usedAt) {
    next(new ApiError(httpStatus.BAD_REQUEST, "Token expired"));
  }

  const user = await User.findById(invitationToken.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid token");
  }

  user.password = await bcrypt.hash(password, 10);
  user.pin = pin;
  await user.save();

  invitationToken.usedAt = new Date();
  await invitationToken.save();

  res.send();
};
