const httpStatus = require("http-status");
const multer = require("multer");
const ApiError = require("../utils/ApiError");

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "application/msword",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(httpStatus.BAD_REQUEST, "File is not image/pdf/doc type")
    );
  }
  cb(null, true); //continue upload
};

module.exports = multer({
  fileFilter: fileFilter,
});
