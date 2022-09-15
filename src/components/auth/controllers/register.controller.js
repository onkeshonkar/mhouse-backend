const httpStatus = require("http-status");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const logger = require("../../../utils/logger");
const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Restaurent = require("../../../models/Restaurent.model");
const Branch = require("../../../models/Branch.model");
const User = require("../../../models/User.model");

const emailService = require("../../../services/email.service");
const tokenService = require("../../../services/token.service");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      venueName: Joi.string().trim().required(),
      fullName: Joi.string().trim().required(),
      phoneNumber: Joi.string()
        .custom(customValidators.phoneNumber)
        .trim()
        .required(),
      email: Joi.string().lowercase().email().trim().required(),
      password: Joi.string().custom(customValidators.password).required(),
    }),
  };

  try {
    validateSchema(req, schema);
    const { venueName, fullName, phoneNumber, email, password } = req.body;

    const userExits = await User.findOne({ email });
    if (userExits) {
      throw new ApiError(httpStatus.CONFLICT, `${email} is already registered`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      type: "OWNER",
    });

    const restaurent = await Restaurent.create({
      venueName,
      owner: user.id,
    });

    const branch = await Branch.create({
      name: venueName,
      manager: user.id,
      isMainBranch: true,
      restaurent: restaurent.id,
    });

    user.branch = branch.id;
    await user.save();

    const { otp, token } = await tokenService.generateOTPToken(user.id);
    await emailService.sendOTPEmail(user, otp);

    return res.json({
      message: `OTP sent to ${user.email}`,
      token,
    });
  } catch (error) {
    next(error);
  }
};
