const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("{{#label}} must be a valid mongo id");
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("{{#label}} must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "{{#label}} must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

const phoneNumber = (value, helpers) => {
  const phoneRegex = /^(\+61)\d{10}$/;
  if (!value.match(phoneRegex)) {
    return helpers.message(
      "{{#label}} number must be of 10 digits with country code +61"
    );
  }
  return value;
};

const pin = (value, helpers) => {
  const pinRegex = /^[0-9]{4}$/;
  if (!value.match(pinRegex)) {
    return helpers.message("{{#label}} is not valid pin");
  }

  return parseInt(value);
};

const mac = (value, helpers) => {
  const pinRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  if (!value.match(pinRegex)) {
    return helpers.message("{{#label}} is not valid mac");
  }

  return value;
};

const time = (value, helpers) => {
  const timeRegex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  if (!value.match(timeRegex)) {
    return helpers.message("{{#label}} is not valid time(HH:mm)");
  }

  return value;
};

const timeDuration = (value, helpers) => {
  if (value.length !== 2) {
    return helpers.message(
      "{{#label}} is not valid array of time [start, end]"
    );
  }

  if (value[0] >= value[1]) {
    return helpers.message(
      "{{#label}}[0] should be smaller than {{#label}}[1]"
    );
  }

  return value;
};

module.exports = {
  objectId,
  password,
  phoneNumber,
  pin,
  mac,
  time,
  timeDuration,
};
