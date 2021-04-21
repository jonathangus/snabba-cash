import create from 'zustand'
import { generateVideo } from '../utiils/api'
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

    console.log({ result })
    set(() => ({
      videoUrl: result.data,
      creating: false,
    }))
  },
}))
