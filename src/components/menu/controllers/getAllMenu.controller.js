const httpStatus = require("http-status");
const Joi = require("joi");

const { ObjectId } = require("mongoose").Types;

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");

const Menu = require("../../../models/Menu.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),
    query: Joi.object({
      meta: Joi.boolean(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "MENU", "view")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;
  const { meta } = req.query;

  if (meta !== undefined && !meta) {
    const menu = await Menu.find({ branch: branchId }).select({
      dish: 1,
      sellPrice: 1,
    });
    return res.send({ menu });
  }

  const menu = await Menu.find({ branch: branchId }).sort({ createdAt: -1 });

  const totalSoldDish = await Menu.aggregate([
    {
      $match: { branch: ObjectId(branchId) },
    },

    {
      $group: {
        _id: null,
        total: {
          $sum: "$sellCount",
        },
      },
    },
  ]);

  res.send({ menu, totalSoldDish: totalSoldDish[0].total });
};
