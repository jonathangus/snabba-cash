import create from 'zustand'
import { ImageEntity, Crop } from '../types'
import { cropImage } from '../utiils/image-utils'
import apiService from '../services/api-service'

type ImageStore = {
  files: ImageEntity[]
  addFile: (file: File) => void
  setCrop: (fileId: string, crop: Crop) => void
}

const defaultCrop: Crop = {
  aspect: 9 / 16,
  unit: '%',
  height: 100,
}

export const useImageStore = create<ImageStore>((set, get) => ({
  files: [],

  setCrop: (fileId, crop) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id !== fileId
          ? file
          : {
              ...file,
              crop,
            }
      ),
    }))
  },

  uploadImages: async () => {
    const { files } = get()
    const images = await Promise.all(
      Object.values(files).map(async (file, i) => {
        return {
          ...file,
          fff: await cropImage(file.original, file.crop, 'hej'),
        }
      })
    )
    apiService.create(images)
  },

  addFile: async (file: File) => {
    const newEntity = {
      uploaded: false,
      original: file,
      id: file.name,
      crop: defaultCrop,
    }

    set((state) => ({
      files: [
        ...state.files.filter((file) => file.id !== newEntity.id),
        newEntity,
      ],
    }))
  },
}))
