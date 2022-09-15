const httpStatus = require("http-status");
require("express-async-errors");
const Joi = require("joi");
const dayjs = require("dayjs");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidator = require("../../../utils/customValidator");

const Otp = require("../../../models/Otp.model");
const User = require("../../../models/User.model");

const tokenService = require("../../../services/token.service");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      otp: Joi.string().trim().required(),
      token: Joi.string().custom(customValidator.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { otp, token: otpId } = req.body;

  const otpDoc = await Otp.findById(otpId);
  if (!otpDoc || otpDoc.otp !== otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const otpExpired = dayjs().isAfter(dayjs(otpDoc.expiry));

  if (otpExpired || otpDoc.usedAt) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");
  }

  const user = await User.findByIdAndUpdate(
    otpDoc.user,
    { emailVerified: true },
    { new: true }
  );
  otpDoc.usedAt = dayjs();
  await otpDoc.save();

  const authToken = tokenService.generateAuthToken(user.id);

  res.json({ user, token: authToken });
};