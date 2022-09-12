const httpStatus = require("http-status");

const ApiEror = require("./ApiError");

const validateSchema = (req, schemas) => {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
    errors: {
      wrap: {
        label: "",
      },
    },
  };

  const keys = ["params", "query", "body"];
  const schemaKeys = Object.keys(schemas); // keys for which schema are defined

  keys.forEach((key) => {
    if (!schemaKeys.includes(key)) {
      req[key] = {};
      return;
    }

    const { error, value } = schemas[key].validate(req[key], options);
    if (error) {
      let errors = error.details.map((x) => x.message).join(", ");
      throw new ApiEror(httpStatus.BAD_REQUEST, errors);
    }
    req[key] = value;
  });
};

module.exports = validateSchema;
