const httpStatus = require("http-status");
const Joi = require("joi");
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
      fullName: Joi.string().trim().required(),
      phoneNumber: Joi.string().custom(customValidators.phoneNumber).required(),
      dateOfBirth: Joi.date().required(),
      email: Joi.string().email().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const { userId } = req.params;

  const { fullName, phoneNumber, dateOfBirth, email } = req.body;

  if (userId !== req.user.id) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      phoneNumber,
      dateOfBirth,
      email,
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User doesn't exists");
  }

  res.status(httpStatus.NO_CONTENT).send();
};
