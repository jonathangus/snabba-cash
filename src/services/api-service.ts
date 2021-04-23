import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'

import { ImageEntity } from '../types'
import { useVideoStore } from '../stores/video-store'
import { addIdToUrl } from '../utiils/common-utils'
import { useUploadStore } from '../stores/upload-store'
import { UploadProgress } from '../enums'
import toast from '../utiils/toast'

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

  getVideoResult = async (tries = 0) => {
    console.log('polling....')

    const videoUrl = await this.pollVideo()
    if (videoUrl) {
      console.log('GOT IT', videoUrl)
      useUploadStore.setState({
        videoUrl,
        status: UploadProgress.COMPLETE,
      })
    } else if (tries > 30) {
      toast.error('Failed loading video. Try again')
    } else {
      setTimeout(() => {
        this.getVideoResult(tries++)
      }, 10000)
    }
  }

  create = async (images: ImageEntity[]): Promise<void> => {
    const zip = new JSZip()

    images.forEach((image) => {
      zip.file(image.id, image.original, { base64: true })
    })

    console.time('Compressing zip')
    const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
      useUploadStore.setState({ progress: metadata.percent })
    })
    console.timeEnd('Compressing zip')

    let url = this.presigned
    if (!url) {
      url = await this.getPresign()
    }

    useUploadStore.setState({ status: UploadProgress.UPLOAD, progress: 0 })

    await axios.put(url, content, {
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        useUploadStore.setState({ progress: percentage })
      },
    })

    console.timeEnd('Upload to s3')

    addIdToUrl(this.zipName)

    useUploadStore.setState({
      status: UploadProgress.WAITING_RESPONSE,
      progress: 0,
    })

    setTimeout(() => {
      this.getVideoResult()
    }, 15000)
  }
}

export default new ApiService()
