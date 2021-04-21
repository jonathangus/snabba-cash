const AWS = require("aws-sdk");
let response;

const s3 = new AWS.S3();

const myBucket = process.env.S3_BUCKET;
const signedUrlExpireSeconds = 60 * 2;

exports.lambdaHandler = async (event, context) => {
  let prefix = event.body;
  console.log("### Event:");
  console.info(event);

  console.log("### Body:");
  console.info(event.body);

  const myKey = "images.zip";

  const params = {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  };

  try {
    const presigned = s3.getSignedUrl("putObject", params);

    console.log(presigned);

    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        presigned,
      }),
    };
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
