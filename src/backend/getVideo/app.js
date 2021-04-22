const AWS = require("aws-sdk");
let response;

const s3 = new AWS.S3();

const resultsBucket = process.env.S3_BUCKET;
const signedUrlExpireSeconds = 60 * 10;

exports.lambdaHandler = async (event, context) => {
  const videoKey = event.pathParameters.video + ".mp4";

  console.log("----------------------MYKEY:", videoKey);
  const params = {
    Bucket: resultsBucket,
    Key: videoKey,
  };

  response = {
    statusCode: null,
    body: null,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
  };
  try {
    console.info("### Checking for headObject with params:");
    console.info(params);
    const headCode = await s3.headObject(params).promise();

    console.info(`${videoKey} was found. Generating presigned URL`);

    const presigned = s3.getSignedUrl("getObject", {
      ...params,
      Expires: signedUrlExpireSeconds,
    });

    response.statusCode = 200;
    response.body = JSON.stringify({ presigned });
  } catch (headErr) {
    console.error(headErr);

    response.statusCode = 404;
    response.body = JSON.stringify({ message: headErr });
  }

  return response;
};
