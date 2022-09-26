const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");
const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      rId: Joi.string().custom(customValidators.objectId).required(),
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      name: Joi.string().trim(),
      manager: Joi.string().custom(customValidators.objectId),
      address: Joi.string().trim(),
    }),
  };

  validateSchema(req, schema);

  const { branchId, rId } = req.params;

  const { name, manager, address } = req.body;

  const branch = await Branch.findById(branchId);

  const oldManager = await User.findById(branch.manager);

  if (oldManager.type !== "OWNER") {
    oldManager.type = undefined;
    await oldManager.save();
  }
  // update  role 'Manager from roles.role

  const newManger = await User.findByIdAndUpdate(manager, { name, address });

  if (newManger.type !== "OWNER") {
    newManger.branch = branch.id;
    newManger.type = "MANAGER";
    await newManger.save();
  }

  res.send({ branch });
};
