const httpStatus = require("http-status");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
require("express-async-errors");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const User = require("../../../models/User.model");

const emailService = require("../../../services/email.service");
const tokenService = require("../../../services/token.service");

const opts = {
  points: 15, // 6 points
  duration: 60 * 5, // Per second
};

const rateLimiter = new RateLimiterMemory(opts);

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      email: Joi.string().lowercase().email().trim().required(),
      password: Joi.string().custom(customValidators.password).required(),
    }),
  };

  validateSchema(req, schema);
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("branch");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  if (!user.emailVerified) {
    const { otp, token } = await tokenService.generateOTPToken(user.id);
    await emailService.sendOTPEmail(user, otp);

    return res.json({
      message: `OTP sent to ${user.email}`,
      token,
    });
  }

  // rate limiter login here

  const token = tokenService.generateAuthToken(user.id);
  res.json({ user, token });
};
