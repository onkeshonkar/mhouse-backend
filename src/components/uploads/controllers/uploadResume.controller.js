const httpStatus = require("http-status");
const Joi = require("joi");
require("express-async-errors");

const ApiError = require("../../../utils/ApiError");
const validateSchema = require("../../../utils/validateSchema");
const customValidators = require("../../../utils/customValidator");
const uploadS3 = require("../../../services/space.service");

const Employee = require("../../../models/Employee.model");

module.exports = async (req, res, next) => {
  const schema = {
    body: Joi.object({
      employeeId: Joi.string().custom(customValidators.objectId).required(),
    }),
  };

  validateSchema(req, schema);

  const { employeeId } = req.body;

  let resume;

  req.files?.forEach((file) => {
    if (file.fieldname === "resume") {
      resume = file;
    }
  });

  if (!resume) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No file found with resume fieldname"
    );
  }

  const fileName =
    employeeId +
    "-" +
    Date.now().toString() +
    "." +
    resume.originalname.split(".")[1];

  let employee = await Employee.findById(employeeId);

  if (!employee) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Employee cannot be found");
  }

  let params = {
    Body: resume.buffer,
    Bucket: `foodlertassests/resume`,
    Key: fileName,
    ACL: "public-read",
    ContentType: resume.mimetype,
  };

  const data = await uploadS3(params);

  employee.resume = `https://assets.foodlert.com/${data.Key}`;
  await employee.save();

  res.send({ data });
};
