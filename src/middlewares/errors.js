const mongoose = require("mongoose");
const httpStatus = require("http-status");

const ApiError = require("../utils/ApiError");
const config = require("../config");
const logger = require("../utils/logger");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error.message || err.code == 11000 ? err : httpStatus[statusCode];

    error = new ApiError(statusCode, message, err.stack);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  const response = {
    statusCode,
    error: httpStatus[statusCode],
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  res.locals.errorMessage = err.message;

  logger.error(err.message);

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
