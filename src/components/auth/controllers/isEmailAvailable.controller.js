const Joi = require("joi");
const User = require("../../../models/User.model");
require("express-async-errors");

const validateSchema = require("../../../utils/validateSchema");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      email: Joi.string().email().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const user = await User.find({ email });

  res.json({ available: !!user });
};
