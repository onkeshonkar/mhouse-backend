const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");

const User = require("../../../models/User.model");

const emailService = require("../../../services/email.service");
const tokenService = require("../../../services/token.service");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      email: Joi.string().lowercase().email().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const { email } = req.body;

  const user = await User.find({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email");
  }

  const token = await tokenService.generateResetPasswordToken(user);
  await emailService.sendResetPasswordEmail(user, token);
  res.json({ message: "Password reset link sent to your email." });
};
