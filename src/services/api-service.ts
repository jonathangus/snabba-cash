import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'

import { ImageEntity } from '../types'

axios.defaults.timeout === 120000

interface IApiService {
  presigned?: string
  getPresign: () => void
}

const id = 'f8bm92sxca'
const apiUrl = `https://${id}.execute-api.eu-north-1.amazonaws.com/Prod`

class ApiService implements IApiService {
  base = apiUrl || process.env.NEXT_PUBLIC_API_ENDPOINT
  presigned?: string

  private getEndpoint = (endpoint: string): string => `${this.base}${endpoint}`
  private zipName = `zip-${uuidv4()}.zip`

  getPresign = async (): Promise<string> => {
    const { data } = await axios.post<{ presigned: string }>(
      this.getEndpoint('/getpresign'),
      JSON.stringify({
        zipName: this.zipName,
      })
    )
    this.presigned = data.presigned
    return this.presigned
  }

  create = async (images: ImageEntity[]): Promise<string> => {
    const zip = new JSZip()

    images.forEach((image) => {
      zip.file(image.id, image.fff, { base64: true })
    })

    const content = await zip.generateAsync({ type: 'blob' })

    let url = this.presigned
    if (!url) {
      url = await this.getPresign()
    }

    // Upload zip
    await axios.put(url, content)

    // Generate video
    const { data } = await axios.post(
      this.getEndpoint('/processimg'),
      JSON.stringify({
        zipName: this.zipName,
      })
    )

    console.log({
      data,
    })

    return data.url
  }
}

export default new ApiService()
