const AWS = require("aws-sdk");
let response;

const s3 = new AWS.S3();

const myBucket = process.env.S3_BUCKET;
const signedUrlExpireSeconds = 60 * 10;

exports.lambdaHandler = async (event, context) => {
  const zipKey = event.pathParameters.images + ".zip";

  console.log("----------------------MYKEY:", zipKey);
  const params = {
    Bucket: myBucket,
    Key: zipKey,
    Expires: signedUrlExpireSeconds,
    ContentType: "application/zip",
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
    const presigned = s3.getSignedUrl("putObject", params);
    console.info(`Generated presigned for ${zipKey} successfully`);
    response.statusCode = 200;
    response.body = JSON.stringify({ presigned });
  } catch (err) {
    console.error(err);

    response.statusCode = 500;
    response.body = JSON.stringify({ message: err });
  }
  return response;
};
