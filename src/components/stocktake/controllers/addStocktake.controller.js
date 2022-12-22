const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Stocktake = require("../../../models/Stocktake.model");
const { notifyAdmins } = require("../../../socketIO");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      item: Joi.string().trim().required(),
      unit: Joi.string()
        .valid("Kg", "Liter", "Box", "Piece", "Package")
        .required(),
      price: Joi.number().min(1).required(),
      minStock: Joi.number().min(1).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "STOCKTAKE", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;

  const { item, unit, price, minStock } = req.body;

  const stocktake = await Stocktake.create({
    item,
    unit,
    price,
    minStock,
    branch: branchId,
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Inventory",
      message: `Stocktake ${stocktake.item} ${stocktake.id} is added`,
    });
  }

  res.status(httpStatus.CREATED).send({ stocktake });
};
