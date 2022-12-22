const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const closingDay = require("../../../models/ClosingDay.model");
const { notifyAdmins } = require("../../../socketIO");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      cash: Joi.number().min(1).required(),
      eftpos: Joi.number().min(0).required(),
      deliveroo: Joi.number().min(0).required(),
      uber: Joi.number().min(0).required(),
      menulog: Joi.number().min(0).required(),
      doorDash: Joi.number().min(0).required(),
      orderUp: Joi.number().min(0).required(),
      pos: Joi.number().min(0).required(),
      transactionCount: Joi.number().min(1).required(),
      totalIncome: Joi.number().min(1).required(),
      note: Joi.string(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  const {
    transactionCount,
    totalIncome,
    note,
    cash,
    eftpos,
    deliveroo,
    uber,
    menulog,
    doorDash,
    orderUp,
    pos,
  } = req.body;

  if (!canAccess(req.user, "CLOSING_DAY", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const closing = await closingDay.create({
    cash,
    eftpos,
    deliveroo,
    uber,
    menulog,
    doorDash,
    orderUp,
    pos,
    transactionCount,
    totalIncome,
    note,
    registeredBy: req.user.id,
    branch: branchId,
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Finance",
      message: `New closing of amount $ ${totalIncome} is added ${closing.id}`,
    });
  }

  res.status(httpStatus.CREATED).send();
};
