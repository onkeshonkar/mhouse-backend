const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId),
    }),

    body: Joi.object({
      notifications: Joi.object()
        .pattern(
          Joi.string().valid(
            "Tasks Assigned To You",
            "New Transfer In Finance",
            "Forecast Update",
            "Targets Update",
            "Update In Suppliers",
            "Items Received",
            "Update Availability Of Employees"
          ),
          Joi.array().items("sms", "email").unique().max(2)
        )
        .required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const { notifications } = req.body;

  const _branch = await Branch.findByIdAndUpdate(
    branchId,
    {
      notifications,
    },
    { new: true }
  ).select({
    notifications: 1,
  });
  return res.json({ notifications: _branch.notifications });
};
