const httpStatus = require("http-status");
const Joi = require("joi");
const mongoose = require("mongoose");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Menu = require("../../../models/Menu.model");
const CateringOrder = require("../../../models/CateringOrder.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      menuId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "MENU", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId, menuId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const menu = await Menu.findByIdAndDelete(menuId, { session });

    const pendingOrders = await CateringOrder.find({
      $and: [{ status: "Open" }, { "cart.menu": menu.id }],
    });

    if (pendingOrders) {
      throw "";
    }

    await session.commitTransaction();
    session.endSession();

    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "cann't delete, cause catering order/s is open for current menu."
    );
  }
};
