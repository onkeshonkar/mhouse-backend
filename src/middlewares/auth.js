const httpStatus = require("http-status");

const ApiError = require("../utils/ApiError");
const tokenService = require("../services/token.service");

const auth = async (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.body.token;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }

  token = token.startsWith("Bearer") && token.split(" ")[1];

  if (!token || token === "") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
  }

  const { user, expired, valid } = await tokenService.validateAuthToken(token);

  if (!valid || expired) {
    throw new ApiError(httpStatus.UNAUTHORIZED);
  }

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User D");
  }

  req.user = user;

  next();
};

module.exports = auth;
