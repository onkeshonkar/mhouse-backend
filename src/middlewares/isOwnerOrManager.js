const httpStatus = require("http-status");

const ApiError = require("../utils/ApiError");

/**
 * @summary restrict access to resourece only owner / manager is authorized
 * @requires branchId from params
 */

const isOwnerOrManager = async (req, res, next) => {
  const { branchId } = req.params;

  if (
    req.user.type === "OWNER" ||
    (req.user.type === "MANAGER" && req.user.branch.id === branchId)
  ) {
    return next();
  }
  throw new ApiError(httpStatus.FORBIDDEN);
};

module.exports = isOwnerOrManager;
