const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const httpStatus = require("http-status");
// const pinoHttp = require("pino-http");

const logger = require("./utils/logger");
const ApiError = require("./utils/ApiError");

const { errorConverter, errorHandler } = require("./middlewares/errors");
const routes = require("./routes");
const isAuth = require("./middlewares/isAuth");

const app = express();

// app.use(
//   pinoHttp({
//     logger: logger,
//   })
// );

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());
app.use(cors());
app.use(compression());

app.use("/api/v1", isAuth, routes);

app.use("/ping", (req, res, next) => {
  res.send("pong");
});

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, `${req.url} cann't be found`));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
