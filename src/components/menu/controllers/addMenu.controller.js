const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Menu = require("../../../models/Menu.model");

module.exports = async (req, res, next) => {
  const rawItemSchema = Joi.object({
    stocktake: Joi.string().custom(customValidators.objectId).required(),
    quantity: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
  });

  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      dish: Joi.string().trim().required(),
      picture: Joi.string().trim().uri().required(),
      category: Joi.string().trim().required(),
      season: Joi.string().trim().required(),
      prepareTime: Joi.number().min(0).required(),
      sellPrice: Joi.number().min(0).required(),
      nutriScore: Joi.string()
        .valid("A", "B", "C", "D", "E")
        .default("A")
        .required(),
      rawItems: Joi.array().items(rawItemSchema).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "MENU", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;

  const {
    dish,
    picture,
    category,
    season,
    prepareTime,
    sellPrice,
    nutriScore,
    rawItems,
  } = req.body;

  const rawMaterialCost = rawItems.reduce((prevVal, currItem) => {
    return prevVal + currItem.price * currItem.quantity;
  }, 0);

  const menu = await Menu.create({
    dish,
    picture,
    category,
    season,
    prepareTime,
    sellPrice,
    nutriScore,
    rawItems,
    rawMaterialCost,
    branch: branchId,
  });

  res.send({ menu });
};