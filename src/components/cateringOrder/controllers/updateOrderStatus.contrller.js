const httpStatus = require("http-status");
const Joi = require("joi");
const mongoose = require("mongoose");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const CateringOrder = require("../../../models/CateringOrder.model");
const Menu = require("../../../models/Menu.model");
const Stocktake = require("../../../models/Stocktakes.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      orderId: Joi.string().custom(customValidators.objectId).required(),
    }),
    body: Joi.object({
      status: Joi.string().valid("Delivered", "Canceled").required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "CATERING_ORDERS", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId, orderId } = req.params;
  const { status } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  //  update order status Delivered/Canceled
  //  update sellCount in menu if status is Delivered
  //  update stocktake quantity

  try {
    const order = await CateringOrder.findOneAndUpdate(
      { _id: orderId, status: "Open" },
      { status: "Delivered", updatedBy: req.user.id },
      {
        new: true,
        session,
      }
    ).populate("cart.menu", "rawItems");

    let stocktakeBulkQuery = [];
    let menuBulkQuery = [];

    if (order && order.status === "Delivered") {
      order.cart.map((menuItem) => {
        menuBulkQuery.push({
          updateOne: {
            filter: { _id: menuItem.menu.id },
            update: { $inc: { sellCount: menuItem.quantity } },
          },
        });

        menuItem.menu.rawItems.forEach((stocktackItem) => {
          let stockQuery = {
            updateOne: {
              filter: { _id: stocktackItem.stocktake },
              update: { $inc: { currentStock: -stocktackItem.quantity } },
            },
          };
          stocktakeBulkQuery.push(stockQuery);
        });
      });

      await Stocktake.bulkWrite(stocktakeBulkQuery, { session });
      await Menu.bulkWrite(menuBulkQuery, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.send({ order });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Transaction aborted."
    );
  }
};
