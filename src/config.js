require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "production",
  port: process.env.PORT || 4000,
  db: process.env.MONGODB_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  do: {
    accessKeyId: process.env.DO_SPACE_ACCESS,
    secretAccessKey: process.env.DO_SPACE_SECRET,
  },

  otp_expiry: process.env.OTP_EXPIRY_MINUTES || 15,

  redis: {
    host: process.env.REDIS_HOST || "0.0.0.0",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || "",
  },

  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
};

module.exports = config;
