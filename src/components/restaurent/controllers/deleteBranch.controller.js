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
  };

  validateSchema(req, schema);

  const { branchId } = req.params;
  // delete  role 'Manager from roles.role

  const branch = await Branch.findByIdAndUpdate(branchId, { deleted: true });

  const _user = await User.findById(branch.manager);

  if (_user.type !== "OWNER") {
    _user.type = "STAFF";
    await _user.save();
  }

  res.status(httpStatus.NO_CONTENT).send();
};
