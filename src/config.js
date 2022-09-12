require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || 4000,
  db:
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URL
      : "mongodb+srv://onkesh_onkar:Onkesh1998@cluster0.s8dke.mongodb.net/foodlert-dev?retryWrites=true&w=majority",

  jwt: {
    secret: process.env.JWT_SECRET || "itsrandombutstillnotrandom",
  },

  otp_expiry: process.env.OTP_EXPIRY_MINUTES || 15,

  email: {
    smtp: {
      host: process.env.SMTP_HOST || "smtp-relay.sendinblue.com",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USERNAME || "onkeshkumaronkar315@gmail.com",
        pass: process.env.SMTP_PASSWORD || "dqQbrJ83AYFkX7BW",
      },
    },
    from: process.env.EMAIL_FROM || "onkeshkumaronkar315@gmail.com",
  },
};

module.exports = config;
