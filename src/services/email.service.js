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
  const resetPasswordUrl = `https://mhouse.com/reset-password?token=${token}`;

  const text = `Dear ${user.fullName},
  To reset your password, click on this link: <a href=${resetPasswordUrl}>click here</a>
  If you didn't requested any password resets, then ignore this email.
 
  Regards
  mhouse Team`;

  await sendEmail(user.email, subject, text);
};

const sendOTPEmail = async (user, otp) => {
  const subject = "Otp Verification";
  const text = `Dear ${user.fullName},

  <strong>${otp}</strong/> is your Verification OTP.
  
  Your OTP will expire after ${config.otp_expiry} min.
  Do not share your otp with anyone.
  
  Regards
  mhouse Team`;

  await sendEmail(user.email, subject, text);
};

const sendInvitationEmail = async (user, token, restaurent) => {
  const subject = "Sign-up Invitation";
  const url = `https://mhouse.com/signup-invitation?token=${token}`;

  const text = `Congrats ${user.fullName} you are onboarded,

  Welcome, to <strong>${restaurent} family.
  Create your password to Login <a href=${url}>click here</a>.
  
 
  Regards
  mhouse Team`;

  await sendEmail(user.email, subject, text);
};

module.exports = {
  sendResetPasswordEmail,
  sendOTPEmail,
  sendInvitationEmail,
};

// Hello there!
// Your Stoplight email verification code is 56d0513786e9.
// Please enter this code in Stoplight to confirm your email.
// Thanks,
// The Stoplight Team
