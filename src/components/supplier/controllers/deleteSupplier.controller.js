const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");
const { notifyAdmins } = require("../../../socketIO");

const Supplier = require("../../../models/Suppliers.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
      supplierId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, " SUPPLIER", "edit")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId, supplierId } = req.params;

  const supplier = await Supplier.findByIdAndDelete(supplierId);

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Inventory",
      message: `Supplier is deleted ${supplier.name} ${supplier.email} ${supplier.id}`,
    });
  }

  res.status(httpStatus.NO_CONTENT).send();
};
