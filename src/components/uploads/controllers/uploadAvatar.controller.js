const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const uploadS3 = require("../../../services/space.service");

const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      userId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { userId } = req.body;

  if (!req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Image file required");
  }

  let avatar;

  req.files?.forEach((file) => {
    if (file.fieldname === "avatar") {
      avatar = file;
    }
  });

  if (!avatar) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No image found with avatar fieldname"
    );
  }

  if (avatar.mimetype.split("/")[0] != "image") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Only image type is allowed");
  }

  const fileName =
    userId +
    "-" +
    Date.now().toString() +
    "." +
    avatar.originalname.split(".")[1];

  let user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User cannot be found");
  }

  let params = {
    Body: avatar.buffer,
    Bucket: `foodlertassests/avatars`,
    Key: fileName,
    ACL: "public-read",
    ContentType: "image/jpg",
  };

  const data = await uploadS3(params);

  user.avatar = `https://assets.foodlert.com/${data.Key}`;
  await user.save();

  res.send({ msg: data });
};
