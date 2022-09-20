const AWS = require("aws-sdk");

const config = require("../config");
const ApiError = require("../utils/ApiError");

const spaceEndPoint = new AWS.Endpoint("sgp1.digitaloceanspaces.com");

const s3 = new AWS.S3({
  endpoint: spaceEndPoint,
  accessKeyId: config.do.accessKeyId,
  secretAccessKey: config.do.secretAccessKey,
});

const uploadS3 = async (params) => {
  try {
    const stored = await s3.upload(params).promise();
    return stored;
  } catch (error) {
    throw error;
  }
};
module.exports = uploadS3;
