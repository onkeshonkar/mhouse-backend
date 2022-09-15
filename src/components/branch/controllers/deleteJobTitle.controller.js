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
    query: Joi.object({
      name: Joi.string().trim().required(),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const { name } = req.query;

  if (
    req.user.type === "OWNER" ||
    (req.user.type === "MANAGER" && req.user.branch.id === branchId)
  ) {
    const _branch = await Branch.findByIdAndUpdate(
      branchId,
      {
        $pull: { jobTitles: name },
      },
      { new: true }
    ).select({ jobTitles: 1 });

    return res
      .status(httpStatus.CREATED)
      .json({ jobTitles: _branch.jobTitles });
  }

  next(new ApiError(httpStatus.FORBIDDEN));
};
