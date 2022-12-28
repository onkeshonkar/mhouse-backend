const httpStatus = require("http-status");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
require("express-async-errors");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const { ObjectId } = require("mongoose").Types;

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const User = require("../../../models/User.model");
const Employee = require("../../../models/Employee.model");

const emailService = require("../../../services/email.service");
const tokenService = require("../../../services/token.service");
const redisClient = require("../../../services/redis");
const logger = require("../../../utils/logger");

const maxConsusectiveFailByIP = 10;

const hourlyLoginFailRateLimit = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "hourly_login_fail-ip",
  points: maxConsusectiveFailByIP,
  duration: 60 * 60, // 1 hour
});

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      email: Joi.string().lowercase().email().trim().required(),
      password: Joi.string().custom(customValidators.password).required(),
    }),
  };

  validateSchema(req, schema);
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate({
    path: "branch",
    select: { deleted: 0, departments: 0, jobTitles: 0, roles: 0 },
  });

  const reqIP = req.headers["x-forwarded-for"] || req.ip;

  const rlResIP = await hourlyLoginFailRateLimit.get(reqIP);

  const crossedHourlyLimit =
    rlResIP !== null && rlResIP.consumedPoints > maxConsusectiveFailByIP;

  // rate limiter login here

  if (crossedHourlyLimit) {
    logger.info(`request failed rate limit ${reqIP}`);
    return res
      .status(httpStatus.TOO_MANY_REQUESTS)
      .json({ message: "TOO MANY REQUEST" });
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    try {
      const x = await hourlyLoginFailRateLimit.consume(reqIP);
    } catch (error) {
      throw new ApiError(httpStatus.TOO_MANY_REQUESTS, "TOO MANY REQUEST");
    }

    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  if (!user.emailVerified) {
    const { otp, verifyOTPToken } = await tokenService.generateOTPToken(
      user.id
    );
    await emailService.sendOTPEmail(user, otp);

    return res.json({
      message: `OTP sent to ${user.email}`,
      verifyOTPToken,
    });
  }

  const authToken = tokenService.generateAuthToken(user.id);

  // emp Id need to fetch roster department for fetching task
  let employee;

  if (user.type !== "OWNER") {
    employee = await Employee.findOne({
      user: ObjectId(user.id),
    }).select({
      department: 1,
    });
  }

  res.json({
    user: {
      ...user.toJSON(),
      ...(employee && {
        employeeId: employee.id,
        department: employee.department,
      }),
    },
    authToken,
  });
};
