const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      branchId: Joi.string().custom(customValidators.objectId),
    }),
  };

  validateSchema(req, schema);

  const { branchId } = req.params;

  const branch = await Branch.findById(branchId).select({
    jobTitles: 1,
    restaurent: 1,
  });

  return res.json({ jobTitles: branch.jobTitles });
};
