import { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import AWS from 'aws-sdk'
import Busboy from 'busboy'

export const config = {
  api: {
    bodyParser: false,
  },
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(500).json({ error: 'Missing POST' })
  }

  const S3 = new AWS.S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.ACCESS_KEY,
  })

  let chunks: Uint8Array[] = []
  let ftype: string
  let fEncoding: string
  let fname: string

  const busboy = new Busboy({ headers: req.headers })
  busboy.on('file', (_fieldname, file, filename, encoding, mimetype) => {
    ftype = mimetype
    fname = filename.replace(/ /g, '_')
    fEncoding = encoding
    file.on('data', (data: any) => {
      chunks.push(data)
    })
  })

  busboy.on('finish', () => {
    if (typeof process.env.IMAGE_BUCKET_NAME !== 'string') {
      return res.status(500).send({ status: 'error' })
    }

    const params = {
      Bucket: process.env.IMAGE_BUCKET_NAME,
      Key: `${uuidv4()}-${fname}`,
      Body: Buffer.concat(chunks),
      ContentEncoding: fEncoding,
      ContentType: ftype,
    }

    S3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        res.status(500).send({ err, status: 'error' })
      } else {
        console.log(data)
        res.status(200).send({
          status: 'success',
          location: data.Location,
        })
      }
    })
  })

  req.pipe(busboy)
}

export default handler
