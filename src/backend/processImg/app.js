const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const unzipper = require('unzipper')
const videoshow = require('videoshow')
const sharp = require('/opt/node_modules/sharp')

videoshow.ffmpeg.setFfmpegPath('/opt/bin/ffmpeg')

const audio = path.join(__dirname + '/audio.mp3')
const logo = path.join(__dirname + '/etablera.png')

const generateVideo = (images, outDir, name) => {
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

  const fileName = `${name.replace('zip', 'mp4')}`

  const output = path.join(outDir, '/', fileName)

  console.log('new video output:', output)
  return new Promise((resolve, reject) => {
    console.log('Starting generating video')

    videoshow(finalImages, videoOptions)
      .audio(audio)
      .logo(logo, {
        xAxis: 20,
        yAxis: 20,
      })
      .complexFilter('lut3d=fade.cube')
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

exports.lambdaHandler = async (event, context) => {
  var myBucket = event.Records[0].s3.bucket.name
  var myKey = event.Records[0].s3.object.key

  console.info('### myBucket: ', myBucket)
  console.info('### myKey: ', myKey)

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
    await s3
      .getObject(params)
      .createReadStream()
      .pipe(unzipper.Extract({ path: outputFolder }))
      .promise()

    const images = fs
      .readdirSync(outputFolder)
      .map((file) => path.join(outputFolder, file))

    const transformPromises = images.map(async (path) => {
      const buffer = await sharp(path)
        .resize({
          width: 1080,
          height: 1920,
          kernel: sharp.kernel.nearest,
          fit: 'cover',
        })
        .toBuffer()
      fs.writeFileSync(path, buffer)
    })

    await Promise.all(transformPromises)

    console.log('----images', images)
    const { filePath, fileName } = await generateVideo(
      images,
      outputFolder,
      myKey
    )
    const fileContent = fs.readFileSync(filePath)

    console.log('Video bucket upload: ', resultBucket)
    console.log('Video key upload: ', fileName)

    // Upload video to s3 and return the response
    const videoBucketParams = {
      Bucket: resultBucket,
      Key: fileName,
      Body: fileContent,
    }
    const result = await s3.upload(videoBucketParams).promise()

    console.log('done deleting folder')

    const url = s3.getSignedUrl('getObject', {
      Bucket: resultBucket,
      Key: fileName,
    })

    if (fs.existsSync(outputFolder)) {
      fs.rmdirSync(outputFolder, { recursive: true })
    }
    console.log('Signed URL::', url)
    return {
      statusCode: 200,
      body: JSON.stringify({ result, url }),
      headers: {
        'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
      },
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
