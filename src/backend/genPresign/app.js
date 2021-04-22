const AWS = require('aws-sdk')
let response

const s3 = new AWS.S3()

const myBucket = process.env.S3_BUCKET
const signedUrlExpireSeconds = 60 * 10

exports.lambdaHandler = async (event, context) => {
  const body =
    typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {}
  const myKey = body.zipName

  console.log('----------------------MYKEY:', myKey)
  const params = {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
    ContentType: 'application/zip',
  }

  try {
    const presigned = s3.getSignedUrl('putObject', params)

    // const ret = await axios(url);
    response = {
      statusCode: 200,
      body: JSON.stringify({
        presigned,
      }),
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
      },
    }
  } catch (err) {
    console.log(err)
    return err
  }

  return response
}
