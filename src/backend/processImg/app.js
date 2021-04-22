const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const unzipper = require('unzipper')
const videoshow = require('videoshow')
const { v4 } = require('uuid')

videoshow.ffmpeg.setFfmpegPath('/opt/bin/ffmpeg')
// videoshow.ffmpeg.setFfprobePath(ffprobePath.path)

let response

const generateVideo = (images, outDir) => {
  const videoOptions = {
    fps: 25,
    transition: false,
    disableFadeOut: true,
    videoBitrate: 1024,
    videoCodec: 'libx264',
    format: 'mp4',
  }

  const finalImages = images.map((img) => ({
    path: img,
    loop: 2,
  }))

  const name = v4()
  const fileName = `${name}.mp4`

  const output = path.join(outDir, '/', fileName)

  console.log('new video output:', output)
  return new Promise((resolve, reject) => {
    console.log('Starting generating video')

    videoshow(finalImages, videoOptions)
      // .audio(audio)
      // .logo(logo, {
      //   xAxis: 0,
      //   yAxis: 100,
      // })
      // .complexFilter('lut3d=fade.cube')
      .save(output)
      .on('start', (command) => {
        console.log('ffmpeg process started:', command)
      })
      .on('error', (error) => {
        console.error('Failed generating video:', error)
        reject(error)
      })
      .on('end', () => {
        console.log('END VIDEO DEON')
        resolve({
          filePath: output,
          fileName,
        })
      })
  })
}

const tmp = path.join('/tmp/')

if (!fs.existsSync(tmp)) {
  console.log('TMP NOT EXIST')
} else {
  console.log('TMP !!!!!!!! EXIST')
}

const s3 = new AWS.S3()

const resultBucket = process.env.S3_BUCKET_RESULT
const myBucket = process.env.S3_BUCKET_INGEST

exports.lambdaHandler = async (event, context) => {
  const body =
    typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {}
  const myKey = body.zipName

  if (!myKey) {
    return {
      statusCode: 200,
      body: {
        error: 'Missing key',
      },
    }
  }

  const params = {
    Bucket: myBucket,
    Key: myKey,
  }

  const outputFolder = path.join(tmp, myKey)
  console.log({ outputFolder })
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder)
  }

  try {
    console.log('LETS GET DA1231TA-----')

    await s3
      .getObject(params)
      .createReadStream()
      .pipe(unzipper.Extract({ path: outputFolder }))
      .promise()

    const images = fs
      .readdirSync(outputFolder)
      .map((file) => path.join(outputFolder, file))
    console.log({ images })

    const { filePath, fileName } = await generateVideo(images, outputFolder)
    const fileContent = fs.readFileSync(filePath)

    // Upload video to s3 and return the response
    const result = await s3.upload({
      Bucket: resultBucket,
      Key: fileName,
      Body: fileContent,
    })

    console.log({ result })

    return {
      statusCode: 500,
      body: JSON.stringify({
        result,
        myKey,
      }),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
        myKey,
      }),
    }
  }
}
