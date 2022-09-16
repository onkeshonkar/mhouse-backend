const httpStatus = require("http-status");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      userId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      password: Joi.string().custom(customValidators.password).required(),
      newPassword: Joi.string().custom(customValidators.password).required(),
    }),
  };

  validateSchema(req, schema);

  const { userId } = req.params;

  const { password, newPassword } = req.body;

  if (userId !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  if (password === newPassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "New and current passwords are same"
    );
  }

  const _user = await User.findById(userId);

  if (!(await bcrypt.compare(password, _user.password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid current password");
  }

  _user.password = await bcrypt.hash(newPassword, 10);
  await _user.save();

  res.status(httpStatus.NO_CONTENT).send();
};
