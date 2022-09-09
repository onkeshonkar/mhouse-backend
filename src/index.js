const mongoose = require("mongoose");

const app = require("./app");
const config = require("./config");
const logger = require("./utils/logger");

let server;

mongoose.connect(config.db).then(() => {
  logger.info("Connected to MONGODB");
  app.listen(config.port, () => {
    console.info(`Listening to http://127.0.0.1:${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close();
    logger.info("Server closed");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM recieved");
  if (server) {
    server.close();
  }
});
