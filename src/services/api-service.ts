import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'

import { ImageEntity } from '../types'
import { useVideoStore } from '../stores/video-store'
import { addIdToUrl } from '../utiils/common-utils'

axios.defaults.timeout === 120000

interface IApiService {
  presigned?: string
  getPresign: () => void
  setId: (id: string) => void
}

const id = 'f8bm92sxca'
const apiUrl = `https://${id}.execute-api.eu-north-1.amazonaws.com/Prod`

class ApiService implements IApiService {
  base = apiUrl || process.env.NEXT_PUBLIC_API_ENDPOINT
  presigned?: string

  private getEndpoint = (endpoint: string, key: string): string =>
    `${this.base}${endpoint}/${key}`
  private zipName = `${uuidv4()}`

  setId = (id: string) => {
    this.zipName = id
  }

  getPresign = async (): Promise<string> => {
    const { data } = await axios.get<{ presigned: string }>(
      this.getEndpoint('/getpresign', this.zipName)
    )
    console.log(
      'presign get endoint',
      this.getEndpoint('/getpresign', this.zipName)
    )
    console.log('zip', this.zipName)
    console.log('presign result: ', data.presigned)
    this.presigned = data.presigned
    return this.presigned
  }

  pollVideo = async () => {
    try {
      const { data } = await axios.get<{ presigned: string }>(
        this.getEndpoint('/getvideo', this.zipName)
      )

      console.log({ data })
      if (data.presigned) {
        return data.presigned
      }
    } catch (e) {
      console.error('----e', e)
    }
  }

  getVideoResult = async () => {
    console.log('polling....')

    const videoUrl = await this.pollVideo()
    if (videoUrl) {
      console.log('GOT IT', videoUrl)
      useVideoStore.setState({
        videoUrl,
        creating: false,
      })
    } else {
      setTimeout(() => {
        this.getVideoResult()
      }, 5000)
    }
  }

  create = async (images: ImageEntity[]): Promise<string> => {
    const zip = new JSZip()

    images.forEach((image) => {
      zip.file(image.id, image.original, { base64: true })
    })

    console.log('start compressing')
    const content = await zip.generateAsync({ type: 'blob' })
    console.log('done compressing')
    let url = this.presigned
    if (!url) {
      url = await this.getPresign()
    }

    console.log(this.presigned)
    // Upload zip
    console.log('upload to s3')
    await axios.put(url, content)
    console.log('upload to s3 done')
    addIdToUrl(this.zipName)

    setTimeout(() => {
      this.getVideoResult()
    }, 15000)
    return ''
  }
}

export default new ApiService()
