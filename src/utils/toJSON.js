module.exports = (schema, removeTimeStamps = true) => {
  schema.set("toJSON", {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;

      if (removeTimeStamps) {
        delete returnedObject.createdAt;
        delete returnedObject.updatedAt;
      }

      delete returnedObject?.password;
    },
  });
};
