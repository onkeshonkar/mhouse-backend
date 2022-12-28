const Redis = require("ioredis");

const config = require("../config");
const logger = require("../utils/logger");

const redisClient = new Redis({ ...config.redis });

redisClient.on("error", (err) => {
  logger.info("cann't connect to redis", err);
});

redisClient.once("connect", () => {
  logger.info("connected to redis");
});

module.exports = redisClient;
