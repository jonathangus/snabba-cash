import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import JSZip from 'jszip'

import { ImageEntity } from '../types'

interface IApiService {
  presigned?: string
  getPresign: () => void
}

class ApiService implements IApiService {
  base =
    'https://f8bm92sxca.execute-api.eu-north-1.amazonaws.com/Prod' ||
    process.env.NEXT_PUBLIC_API_ENDPOINT
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

  create = async (images: ImageEntity[]) => {
    const zip = new JSZip()

    images.forEach((image) => {
      zip.file(image.id, image.fff, { base64: true })
    })

    const content = await zip.generateAsync({ type: 'blob' })

    let url = this.presigned
    if (!url) {
      url = await this.getPresign()
    }

    const data = await axios.put(url, content)

    console.log({ data })
  }
}

export default new ApiService()
