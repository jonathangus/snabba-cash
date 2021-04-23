import create from 'zustand'
import { ImageEntity, Crop } from '../types'
import { cropImage } from '../utiils/image-utils'
import apiService from '../services/api-service'
import config from '../config'

type ImageStore = {
  files: ImageEntity[]
  addFile: (file: File) => void
  setCrop: (fileId: string, crop: Crop) => void
  canUpload: boolean
}

const defaultCrop: Crop = {
  aspect: 9 / 16,
  unit: '%',
  height: 100,
}

export const useImageStore = create<ImageStore>((set, get) => ({
  files: [],
  canUpload: false,

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

  addFile: async (file: File) => {
    const newEntity = {
      uploaded: false,
      original: file,
      id: file.name,
      crop: defaultCrop,
    }

    set((state) => {
      const files = [
        ...state.files.filter((file) => file.id !== newEntity.id),
        newEntity,
      ]

      return {
        files,
        canUpload:
          files.length >= config.MIN_FILES && files.length < config.MAX_FILES,
      }
    })
  },
}))
