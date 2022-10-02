const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const uploadS3 = require("../../../services/space.service");

const Employee = require("../../../models/Employee.model");
const User = require("../../../models/User.model");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      employeeId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { employeeId } = req.body;

  let avatar, resume, logo;

  req.files?.forEach((file) => {
    if (file.fieldname === "avatar") {
      avatar = file;
    } else if (file.fieldname === "resume") {
      resume = file;
    } else if (file.fieldname === "logo") {
      logo = file;
    }
  });

  // console.log(logo);

  if (avatar && avatar.mimetype.split("/")[0] !== "image") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only image type avatar is allowed"
    );
  }

  if (logo && logo.mimetype.split("/")[0] !== "image") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only image type Logo is allowed"
    );
  }

  let employee = await Employee.findById(employeeId);
  if (!employee) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Employee cannot be found");
  }

  if (avatar) {
    const fileName = `${employee.user}-${Date.now().toString()}.${
      avatar.originalname.split(".")[1]
    }`;

    let params = {
      Body: avatar.buffer,
      Bucket: `foodlertassests/avatars`,
      Key: fileName,
      ACL: "public-read",
      ContentType: avatar.mimetype,
    };

    const data = await uploadS3(params);

    await User.findByIdAndUpdate(employee.user, {
      avatar: `https://assets.foodlert.com/${data.Key}`,
    });
  }

  if (resume) {
    const fileName = `${employeeId}-${Date.now().toString()}.${
      resume.originalname.split(".")[1]
    }`;

    let params = {
      Body: resume.buffer,
      Bucket: `foodlertassests/resume`,
      Key: fileName,
      ACL: "public-read",
      ContentType: resume.mimetype,
    };

    const data = await uploadS3(params);

    employee.resume = `https://assets.foodlert.com/${data.Key}`;
  }

  if (logo) {
    const fileName = `${employeeId}-${Date.now().toString()}.${
      logo.originalname.split(".")[1]
    }`;

    let params = {
      Body: logo.buffer,
      Bucket: `foodlertassests/others`,
      Key: fileName,
      ACL: "public-read",
      ContentType: logo.mimetype,
    };

    const data = await uploadS3(params);

    employee.set("experience.logo", `https://assets.foodlert.com/${data.Key}`);
  }
  await employee.save();

  res.status(httpStatus.NO_CONTENT).send();
};
