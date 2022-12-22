const httpStatus = require("http-status");
const Joi = require("joi");

require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const canAccess = require("../../../utils/canAccess");
const Announcement = require("../../../models/Announcement.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId).required(),
    }),

    body: Joi.object({
      title: Joi.string().trim().required(),
      mediaURL: Joi.string().uri(),
      department: Joi.string().trim().required(),
      text: Joi.string().trim().max(1000).required(),
    }),
  };

  validateSchema(req, schema);

  if (!canAccess(req.user, "NEWS_FEED", "add")) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to access this resource"
    );
  }

  const { branchId } = req.params;

  const { title, mediaURL, department, text } = req.body;

  await Announcement.create({
    title,
    mediaURL,
    department,
    text,
    branch: branchId,
  });

  res.status(httpStatus.CREATED).send();
};
