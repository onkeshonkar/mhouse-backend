const dayjs = require("dayjs");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

const config = require("../config");

const Otp = require("../models/Otp.model");
const Token = require("../models/Token.model");
const User = require("../models/User.model");

const generateOtp = () => {
  return otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

const generateAuthToken = (userId) => {
  const payload = {
    type: "AUTH_TOKEN",
    data: userId,
  };

  return jwt.sign(payload, config.jwt.secret, { expiresIn: "12h" });
};

const validateAuthToken = async (token) => {
  try {
    let decoded = jwt.verify(token, config.jwt.secret);

    if (decoded && decoded.type === "AUTH_TOKEN") {
      const user = await User.findById(decoded.data).populate("branch", [
        "restaurent",
        "name",
        "isMainBranch",
      ]);
      return { valid: true, user: user.toJSON(), expired: false };
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { expired: true, valid: false };
    }
    return { valid: false };
  }
};

const generateResetPasswordToken = async (user) => {
  const resetPasswordToken = await Token.create({
    type: "RESET_PASSWORD",
    user: user.id,
  });

  const payload = {
    type: "RESET_PASSWORD_TOKEN",
    data: resetPasswordToken.id,
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: "30m",
  });

  return token;
};

const validateResetPasswordToken = async (token) => {
  try {
    let decoded = jwt.verify(token, config.jwt.secret);
    if (decoded && decoded.type === "RESET_PASSWORD_TOKEN") {
      const _token = await Token.findById(decoded.data);

      if (_token && _token.type === "RESET_PASSWORD") {
        return { expired: false, valid: true, resetPasswordToken: _token };
      }
      return { valid: false };
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { expired: true, valid: false };
    }
    return { valid: false };
  }
};

const generateInvitationToken = async (user) => {
  const invitationToken = await Token.create({
    type: "SIGNUP_INVITATION",
    user: user.id,
  });

  const payload = {
    type: "SIGNUP_INVITATION_TOKEN",
    data: invitationToken.id,
  };

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn: "10d",
  });

  return token;
};

const validateInvitationToken = async (token) => {
  try {
    let decoded = jwt.verify(token, config.jwt.secret);
    if (decoded && decoded.type === "SIGNUP_INVITATION_TOKEN") {
      // const id = Buffer.from(decoded.data, "base64").toString();

      const _token = await Token.findById(decoded.data);
      if (_token && _token.type === "SIGNUP_INVITATION") {
        return { expired: false, valid: true, invitationToken: _token };
      }
      return { valid: false };
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return { expired: true, valid: false };
    }
    return { valid: false };
  }
};

const generateOTPToken = async (userId) => {
  const otp = generateOtp();
  const expiry = dayjs().add(config.otp_expiry, "minute");
  const otpDoc = await Otp.create({ otp, expiry, user: userId });
  return { token: otpDoc.id, otp };
};

module.exports = {
  generateAuthToken,
  validateAuthToken,
  generateResetPasswordToken,
  validateResetPasswordToken,
  generateInvitationToken,
  validateInvitationToken,
  generateOTPToken,
};
