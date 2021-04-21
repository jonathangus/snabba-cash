import axios from 'axios'

type UploadImageResponse =
  | {
      success: false
      error: string
    }
  | {
      success: true
      imageUrl: string
    }

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
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
    return {
      success: true,
      imageUrl: data.location,
    }
  } catch (e) {
    return {
      success: false,
      error: e.message,
    }
  }
}
