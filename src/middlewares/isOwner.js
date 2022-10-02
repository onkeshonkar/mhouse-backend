const httpStatus = require("http-status");

const ApiError = require("../utils/ApiError");

/**
 * @summary restrict access to resourece only owner
 
 */

const isOwner = async (req, res, next) => {
  if (req.user.type === "OWNER") {
    return next();
  }
  throw new ApiError(httpStatus.FORBIDDEN);
};

module.exports = isOwner;
