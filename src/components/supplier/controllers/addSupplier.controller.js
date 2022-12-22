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
    }),

    body: Joi.object({
      name: Joi.string().trim().required(),
      email: Joi.string().trim().lowercase().email().required(),
      portalURL: Joi.string().trim().lowercase().uri().required(),
      phoneNumber: Joi.string().custom(customValidators.phoneNumber).required(),
      officePhone: Joi.string().custom(customValidators.phoneNumber).required(),
      fullAddress: Joi.string().required(),
      department: Joi.string().required(),
      orderVia: Joi.string()
        .valid("Email", "SMS", "Portal", "Link Via SMS")
        .required(),
      minOrderValue: Joi.number().min(0).integer().required(),
      deliveryFee: Joi.number().min(0).required(),
      deliveryInstruction: Joi.string().required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const {
    name,
    email,
    portalURL,
    phoneNumber,
    officePhone,
    fullAddress,
    department,
    orderVia,
    minOrderValue,
    deliveryFee,
    deliveryInstruction,
  } = req.body;

  if (!canAccess(req.user, "SUPPLIER", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const supplier = await Supplier.create({
    name,
    email,
    portalURL,
    phoneNumber,
    officePhone,
    fullAddress,
    department,
    orderVia,
    minOrderValue,
    deliveryFee,
    deliveryInstruction,
    branch: branchId,
  });

  if (req.user.type !== "OWNER") {
    notifyAdmins({
      user: req.user,
      module: "Inventory",
      message: `New supplier is Added ${supplier.name} ${supplier.email} ${supplier.id}`,
    });
  }

  res.status(httpStatus.CREATED).send({ supplier });
};
