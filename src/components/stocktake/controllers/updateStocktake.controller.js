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
      stocktakeId: Joi.string().custom(customValidators.objectId).required(),
    }),
    body: Joi.object({
      waste: Joi.number().required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "STOCKTAKE", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId, stocktakeId } = req.params;

  const stocktake = await Stocktake.findByIdAndUpdate(stocktakeId, {
    $inc: { waste, stock: waste },
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Inventory",
      message: `Stocktake ${stocktake.item} ${stocktake.id} is updated`,
    });
  }

  res.send({ stocktake });
};
