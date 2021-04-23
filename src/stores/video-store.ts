import create from 'zustand'
import apiService from '../services/api-service'
import { useImageStore } from './image-store'

type VideoStore = {
  videoUrl?: string
  creating: boolean
  generateVideo: () => Promise<void>
  fetchVideoFromId: (id: string) => Promise<void>
}

export const useVideoStore = create<VideoStore>((set, get) => ({
  creating: false,
  generateVideo: async () => {
    set(() => ({
      creating: true,
    }))
    const { files } = useImageStore.getState()

    await apiService.create(files)

    // if (result.success) {

    // } else {
    //   toast.error('Video could not be generated. Try again')
    //   set(() => ({
    //     creating: false,
    //   }))
    // }
  },

  fetchVideoFromId: async (id: string) => {
    apiService.setId(id)
    set(() => ({
      creating: true,
    }))

    await apiService.getVideoResult()
  },
}))
