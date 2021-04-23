import create from 'zustand'
import apiService from '../services/api-service'
import { generateVideo } from '../utiils/api'
import { cropImage } from '../utiils/image-utils'
import toast from '../utiils/toast'
import { useImageStore } from './image-store'

type VideoStore = {
  videoUrl?: string
  creating: boolean
  generateVideo: () => Promise<void>
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  creating: false,
  generateVideo: async () => {
    set(() => ({
      creating: true,
    }))
    const { files } = useImageStore.getState()

    const images = await Promise.all(
      Object.values(files).map(async (file, i) => {
        return {
          ...file,
          fff: await cropImage(file.original, file.crop, 'hej'),
        }
      })
    )
    await apiService.create(images)

    // if (result.success) {

    // } else {
    //   toast.error('Video could not be generated. Try again')
    //   set(() => ({
    //     creating: false,
    //   }))
    // }
  },
}))
