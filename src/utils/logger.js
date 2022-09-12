const pino = require("pino");

const streams = [
  { stream: process.stdout },
  { stream: pino.destination("app.log") },
];

module.exports = pino(
  {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    redact: {
      paths: [
        "password",
        "*.password",
        "*.body.password",
        "req.headers['authorization']",
      ],
      censor: "**SENSETIVE INFORMATION**",
    },
  },
  pino.multistream(streams)
);
