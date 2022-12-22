const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");
const { notifyAdmins } = require("../../../socketIO");

const StocktakeOrder = require("../../../models/StocktakeOrder.model");

module.exports = async (req, res, next) => {
  const cartSchema = Joi.object({
    stocktakeId: Joi.string().custom(customValidators.objectId).required(),
    item: Joi.string().required(),
    unit: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
  });

  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      orderItems: Joi.array().items(cartSchema).required(),
      paymentMethod: Joi.string().valid("Cash", "Eftpos", "Credit").required(),
      upfrontPayment: Joi.number().min(0).required(),
      supplier: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "SUPPLIER", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;

  const { orderItems, paymentMethod, upfrontPayment, supplier } = req.body;

  const orderValue = orderItems.reduce((prevVal, currItem) => {
    return prevVal + currItem.price * currItem.quantity;
  }, 0);

  const stocktakeOrder = await StocktakeOrder.create({
    orderItems,
    paymentMethod,
    upfrontPayment,
    orderValue,
    supplier,
    createdBy: req.user.id,
    branch: branchId,
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Inventory",
      message: `New stocktake order is placed ${stocktakeOrder.id}`,
    });
  }

  res.status(httpStatus.CREATED).send({ stocktakeOrder });
};
