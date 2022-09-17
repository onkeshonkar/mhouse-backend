const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");
const { ObjectId } = require("mongoose").Types;

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");

const User = require("../../../models/User.model");
const Branch = require("../../../models/Branch.model");

module.exports = async (req, res, next) => {
  const schema = {};

  validateSchema(req, schema);

  if (req.user.type !== "OWNER") {
    throw new ApiError(httpStatus.FORBIDDEN);
  }

  const allBranches = await Branch.find({
    restaurent: req.user.restaurent,
  })
    .select({ _id: 1 })
    .lean();

  const users = await User.find({
    branch: { $in: [...allBranches.map((b) => b._id)] },
    deleted: false,
  })
    .select({
      fullName: 1,
      email: 1,
      avatar: 1,
      phoneNumber: 1,
      branch: 1,
    })
    .populate("branch", ["name"]);

  res.send({ users });
};
