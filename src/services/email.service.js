const nodemailer = require("nodemailer");

const config = require("../config");
const logger = require("../utils/logger");

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

const sendResetPasswordEmail = async (user, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `https://foodlert.com/reset-password?token=${token}`;

  const text = `Dear ${user.fullName},
  To reset your password, click on this link: ${resetPasswordUrl}
  If you didn't requested any password resets, then ignore this email.
 
  Regards
  Foodlert Team`;

  await sendEmail(user.email, subject, text);
};

const sendOTPEmail = async (user, otp) => {
  const subject = "Otp Verification";
  const text = `Dear ${user.fullName},

  <strong>${otp}</strong/> is your Verification OTP.
  
  Your OTP will expire after ${config.otp_expiry} min.
  Do not share your otp with anyone.
  
  Regards
  Foodlert Team`;

  await sendEmail(user.email, subject, text);
};

const sendInvitationEmail = async (user, token, restaurent) => {
  const subject = "SignUp Invitation";
  const resetPasswordUrl = `https://foodlert.com/signup-invitatio?token=${token}`;

  const text = `Congrats ${user.fullName},

  Welcome, to <strong>${restaurent} family.
  Create your password to Login ${resetPasswordUrl}.
  
 
  Regards
  Foodlert Team`;

  await sendEmail(user.email, subject, text);
};

module.exports = {
  sendResetPasswordEmail,
  sendOTPEmail,
  sendInvitationEmail,
};
