const AWS = require('aws-sdk')
const path = require('path')
const fs = require('fs')
const unzipper = require('unzipper')
const videoshow = require('videoshow')
const sharp = require('/opt/node_modules/sharp')

videoshow.ffmpeg.setFfmpegPath('/opt/bin/ffmpeg')

const audio = path.join(__dirname + '/audio.mp3')
const logo = path.join(__dirname + '/etablera.png')

const baseTiming = [
  {
    index: 0,
    time: 0.7,
  },
  {
    index: 0,
    time: 0.8,
    upScale: 1.3,
  },
  {
    index: 1,
    time: 1.2,
  },
  {
    index: 2,
    time: 1.6,
  },
  {
    index: 3,
    time: 3.2,
  },
  {
    index: 3,
    time: 1.1,
    upScale: 1.2,
  },
  {
    index: 4,
    time: 2.3,
  },
  {
    index: 5,
    time: 0.7,
  },
  {
    index: 5,
    time: 0.8,
    upScale: 1.3,
  },
  {
    index: 6,
    time: 1.2,
  },
  {
    index: 7,
    time: 1.6,
  },
  {
    index: 8,
    time: 3.2,
  },
  {
    index: 8,
    time: 1.1,
    upScale: 1.2,
  },
  {
    index: 9,
    time: 2.3,
  },
  {
    index: 10,
    time: 0.7,
  },
  {
    index: 11,
    time: 0.8,
  },
  {
    index: 11,
    time: 1.2,
    upScale: 1.3,
  },
  {
    index: 12,
    time: 1.6,
  },
  {
    index: 13,
    time: 3.2,
  },
  {
    index: 14,
    time: 1.1,
  },
]

const getTiming = (extra) => (timing) => ({
  ...timing,
  index: timing.index + 14 * extra,
})

const timings = [
  ...baseTiming,
  ...baseTiming.map(getTiming(1)),
  ...baseTiming.map(getTiming(2)),
  ...baseTiming.map(getTiming(3)),
  ...baseTiming.map(getTiming(4)),
  ...baseTiming.map(getTiming(5)),
  ...baseTiming.map(getTiming(6)),
  ...baseTiming.map(getTiming(7)),
  ...baseTiming.map(getTiming(8)),
  ...baseTiming.map(getTiming(9)),
  ...baseTiming.map(getTiming(10)),
  ...baseTiming.map(getTiming(11)),
  ...baseTiming.map(getTiming(12)),
  ...baseTiming.map(getTiming(13)),
  ...baseTiming.map(getTiming(14)),
  ...baseTiming.map(getTiming(15)),
  ...baseTiming.map(getTiming(16)),
  ...baseTiming.map(getTiming(17)),
  ...baseTiming.map(getTiming(18)),
  ...baseTiming.map(getTiming(19)),
  ...baseTiming.map(getTiming(20)),
]

const generateVideo = (images, outDir, name) => {
  const videoOptions = {
    fps: 25,
    transition: false,
    disableFadeOut: true,
    videoBitrate: 1024,
    videoCodec: 'libx264',
    format: 'mp4',
  }

  const fileName = `${name.replace('zip', 'mp4')}`

  const output = path.join(outDir, '/', fileName)

  console.log('new video output:', output)
  return new Promise((resolve, reject) => {
    console.log('Starting generating video')

    videoshow(images, videoOptions)
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

    const images = fs.readdirSync(outputFolder).map((file) => ({
      filename: file,
      path: path.join(outputFolder, file),
    }))

    const transformPromises = images.map(async ({ path }) => {
      const buffer = await sharp(path)
        .resize({
          width: 1080,
          height: 1920,
          fit: 'cover',
          position: sharp.strategy.attention,
        })
        .toBuffer()
      fs.writeFileSync(path, buffer)
    })

    await Promise.all(transformPromises)

    const imagesForVideo = images.reduce((result, curr, i) => {
      const match = timings.filter((item) => item.index === i)
      match.forEach((item) => {
        result.push({
          ...curr,
          loop: item.time,
          upScale: item.upScale,
        })
      })
      return result
    }, [])

    const finalImages = await Promise.all(
      imagesForVideo.map(async (item) => {
        if (item.upScale) {
          const newPath = path.join(
            outputFolder,
            `${Math.random()}-${item.filename}`
          )
          fs.copyFileSync(item.path, newPath)

          const IMAGE_WIDTH = 1080
          const IMAGE_HEIGHT = 1920

          const fullWidth = parseInt(
            IMAGE_WIDTH - IMAGE_WIDTH * (item.upScale - 1)
          )
          const left = IMAGE_WIDTH - fullWidth
          const fullHeight = parseInt(
            IMAGE_HEIGHT - IMAGE_HEIGHT * (item.upScale - 1)
          )
          const top = IMAGE_HEIGHT - fullHeight
          console.log('CROPPED FILE: ', newPath)
          console.log('FILE EXIST: ', fs.existsSync(newPath))
          const buffer = await sharp(newPath)
            .extract({
              width: fullWidth,
              height: fullHeight,
              left: left,
              top: top,
            })
            .resize({
              width: 1080,
              height: 1920,
              fit: 'cover',
              position: sharp.strategy.attention,
            })
            .toBuffer()

          fs.writeFileSync(newPath, buffer)
          return {
            ...item,
            path: newPath,
          }
        }

        return item
      })
    )

    const { filePath, fileName } = await generateVideo(
      finalImages,
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
