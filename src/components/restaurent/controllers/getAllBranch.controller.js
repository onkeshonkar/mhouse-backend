const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const { ObjectId } = require("mongoose").Types;

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {
    params: Joi.object({
      rId: Joi.string().custom(customValidators.objectId).required(),
    }),
    query: Joi.object({
      details: Joi.string().valid("basic", "semi", "full").default("basic"),
      manager: Joi.boolean().default(false),
    }),
  };

  validateSchema(req, schema);

  const { rId } = req.params;
  const { details, manager } = req.query;

  if (rId !== req.user.restaurent.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  let select = {};

  if (details === "basic") {
    select = {
      name: 1,
      manager: 1,
      isMainBranch: 1,
      restaurent: 1,
      address: 1,
    };
  } else if (details === "semi") {
    select = {
      deleted: 0,
      departments: 0,
      jobTitles: 0,
      roles: 0,
    };
  }

  if (manager) {
    const branches = await Branch.find({
      restaurent: new ObjectId(rId),
      deleted: false,
    })
      .select(select)
      .populate("manager", ["fullName", "avatar", "email"]);

    return res.send({ branches });
  }

  const branches = await Branch.find({
    restaurent: new ObjectId(rId),
    deleted: false,
  }).select(select);

  res.send({ branches });
};
