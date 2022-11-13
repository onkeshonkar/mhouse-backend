const httpStatus = require("http-status");
const Joi = require("joi");

const mongoose = require("mongoose");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const StocktakeOrder = require("../../../models/StocktakeOrder.model");
const Supplier = require("../../../models/Suppliers.model");
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

  if (
    !canAccess(req.user, "SUPPLIER", "edit") ||
    !canAccess(req.user, "SUPPLIER", "add")
  ) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { orderId } = req.params;
  const { status } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await StocktakeOrder.findOneAndUpdate(
      { _id: orderId, status: "Open" },
      { status, updatedBy: req.user.id },
      { new: true, session }
    );

    const bulkQuery = [];

    if (order && order.status === "Delivered") {
      order.orderItems.map((orderItem) => {
        let query = {
          updateOne: {
            filter: { item: orderItem.item },
            update: {
              $inc: { currentStock: orderItem.quantity },
              "lastBuy.quantity": orderItem.quantity,
              "lastBuy.date": Date.now(),
            },
          },
        };

        bulkQuery.push(query);
      });

      await Stocktake.bulkWrite(bulkQuery, { session });

      await Supplier.findByIdAndUpdate(
        order.supplier,
        {
          $inc: { purchaseCount: 1, purchaseValue: order.orderValue },
        },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.send({ order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Transaction aborted."
    );
  }
};
