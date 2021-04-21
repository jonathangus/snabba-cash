const AWS = require("aws-sdk");
let response;

const s3 = new AWS.S3();

const myBucket = process.env.S3_BUCKET_RESULT;
const ingestBucket = proces.env.S3_BUCKET_INGEST;

const myKey = "images.txt";
const signedUrlExpireSeconds = 60 * 2;

exports.lambdaHandler = async (event, context) => {
  console.log("### Event:");
  console.info(event);
  mykey = "images.zip";

  // fetch zipped data from S3_BUCKET_INGEST
  // unzip
  // make video
  // upload to S3_BUCKET_RESULT
  // gen presigned (get) to S3_BUCKET_RESULT video object

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
