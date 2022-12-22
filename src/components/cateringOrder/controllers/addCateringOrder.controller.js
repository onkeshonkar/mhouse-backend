const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const CateringOrder = require("../../../models/CateringOrder.model");
const canAccess = require("../../../utils/canAccess");
const { notifyAdmins } = require("../../../socketIO");

module.exports = async (req, res, next) => {
  const cartSchema = Joi.object({
    menu: Joi.string().custom(customValidators.objectId).required(),
    dish: Joi.string().required(),
    quantity: Joi.number().min(0).required(),
    sellPrice: Joi.number().min(0).required(),
  });

  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      clientName: Joi.string().trim().required(),
      phoneNumber: Joi.string()
        .trim()
        .custom(customValidators.phoneNumber)
        .required(),
      fullAddress: Joi.string().required(),
      deliveryMethod: Joi.string().valid("Delivery", "Pickup").required(),
      deliveryDate: Joi.date().required(),
      paymentMethod: Joi.string().valid("Cash", "Eftpos", "Credit").required(),
      upfrontPayment: Joi.number().min(0).required(),
      notes: Joi.string(),
      cart: Joi.array().items(cartSchema).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "CATERING_ORDERS", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;

  const {
    clientName,
    phoneNumber,
    fullAddress,
    deliveryMethod,
    deliveryDate,
    paymentMethod,
    upfrontPayment,
    notes,
    cart,
  } = req.body;

  const orderAmount = cart.reduce((prevVal, currItem) => {
    return prevVal + currItem.sellPrice * currItem.quantity;
  }, 0);

  const cateringOrder = await CateringOrder.create({
    clientName,
    phoneNumber,
    fullAddress,
    deliveryMethod,
    deliveryDate,
    paymentMethod,
    upfrontPayment,
    notes,
    cart,
    orderAmount,
    createdBy: req.user.id,
    branch: branchId,
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Catering",
      message: `New catering-order of amount $ ${orderAmount} is added ${cateringOrder.id}`,
    });
  }

  res.send({ cateringOrder });
};
