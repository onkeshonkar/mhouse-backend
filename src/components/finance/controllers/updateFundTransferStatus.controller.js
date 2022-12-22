const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");
const FundTransfer = require("../../../models/FundTransfer.model");
const { notifyAdmins } = require("../../../socketIO");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      fTransferId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      status: Joi.string().valid("Canceled", "Approved").required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "FUND_TRANSFER", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId, fTransferId } = req.params;

  const { status } = req.body;

  const fundTransfer = await FundTransfer.findByIdAndUpdate(
    fTransferId,
    { status },
    { new: true }
  ).populate("depositor", ["fullName", "avatar"]);

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Finance",
      message: `Fund trasnfer ${fundTransfer.id} of $ ${fundTransfer.amount} is ${status}`,
    });
  }

  res.send({ fundTransfer });
};
