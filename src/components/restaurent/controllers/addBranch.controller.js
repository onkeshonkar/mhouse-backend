const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");
const User = require("../../../models/User.model");
const Employee = require("../../../models/Employee.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      rId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      name: Joi.string().trim().required(),
      manager: Joi.string().custom(customValidators.objectId).required(),
      address: Joi.string().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const { rId } = req.params;

  const { name, manager, address } = req.body;

  if (rId !== req.user.restaurent.toString()) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      `You are not allowed to access ${rId} restaurent`
    );
  }

  const _branch = await Branch.create({
    name,
    manager,
    address,
    restaurent: rId,
  });

  const _user = await User.findById(manager);

  if (_user.type !== "OWNER") {
    _user.branch = _branch.id;
    _user.type = "MANAGER";
    await _user.save();
  }

  await Employee.findOneAndUpdate({ user: _user.id }, { branch: _branch.id });

  res.status(httpStatus.CREATED).send({ branch: _branch });
};
