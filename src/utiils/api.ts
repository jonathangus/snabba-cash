import axios from 'axios'
import { ImageEntity } from '../types'
import { cropImage } from './image-utils'

type ApiResponse =
  | {
      success: false
      error: string
    }
  | {
      success: true
      data: string
    }

export const uploadImage = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData()

  formData.append('file', file)

  try {
    const { data } = await axios.post<{ location: string }>(
      '/api/image-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    console.log(data.location)
    return {
      success: true,
      data: data.location,
    }
  } catch (e) {
    return {
      success: false,
      error: e.message,
    }
  }
}

export const generateVideo = async (
  files: ImageEntity[]
): Promise<ApiResponse> => {
  const formData = new FormData()

  // console.log({ files })
  const images = await Promise.all(
    files.map((file, i) => cropImage(file.original, file.crop, 'hej'))
  )

  console.log({ images })

  // images.forEach((file) => {
  //   console.log(file)
  //   formData.append('images', file, file.id)
  // })
  files.forEach((file) => {
    formData.append('images', file.original)
  })
  try {
    const { data } = await axios.post<{ Location: string }>(
      process.env.NEXT_PUBLIC_CREATE_ENDPOINT || '',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    console.log(data)
    return {
      success: true,
      data: data.Location,
    }
  } catch (e) {
    return {
      success: false,
      error: e.message,
    }
  }
}
