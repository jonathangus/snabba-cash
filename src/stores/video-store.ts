import create from 'zustand'
import { generateVideo } from '../utiils/api'
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
    const result = await generateVideo(Object.values(files))

    if (result.success) {
      set(() => ({
        videoUrl: result.data,
        creating: false,
      }))
    } else {
      toast.error('Video could not be generated. Try again')
      set(() => ({
        creating: false,
      }))
    }
  },
}))
