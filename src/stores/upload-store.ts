import create from 'zustand'
import { UploadProgress } from '../enums'
import apiService from '../services/api-service'
import { useImageStore } from './image-store'

type UploadStore = {
  generateVideo: () => Promise<void>
  fetchVideoFromId: (id: string) => Promise<void>
  status: UploadProgress
  progress: number
  videoUrl?: string
}

export const useUploadStore = create<UploadStore>((set) => ({
  status: UploadProgress.NOT_STARTED,
  progress: 0,
  generateVideo: async () => {
    set(() => ({
      status: UploadProgress.COMPRESSING,
      progress: 0,
    }))

    const { files } = useImageStore.getState()
    await apiService.create(files)
  },

  fetchVideoFromId: async (id: string) => {
    apiService.setId(id)
    set(() => ({
      status: UploadProgress.WAITING_RESPONSE,
      progress: 0,
    }))

    await apiService.getVideoResult()
  },
}))
