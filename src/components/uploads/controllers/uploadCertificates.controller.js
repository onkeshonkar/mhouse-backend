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

  let certificate;

  req.files?.forEach((file) => {
    if (file.fieldname === "certificate") {
      certificate = file;
    }
  });

  if (!certificate) {
    throw new ApiError(httpStatus.BAD_REQUEST, "certificate file is required");
  }

  const fileName =
    employeeId +
    "-" +
    Date.now().toString() +
    "." +
    certificate.originalname.split(".")[1];

  let employee = await Employee.findById(employeeId);

  if (!employee) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Employee cannot be found");
  }

  let params = {
    Body: certificate.buffer,
    Bucket: `foodlertassests/sick-certificates`,
    Key: fileName,
    ACL: "public-read",
    ContentType: certificate.mimetype,
  };

  const data = await uploadS3(params);

  employee.sickCertificates = `https://assets.foodlert.com/${data.Key}`;
  await employee.save();

  res.send({ data });
};
