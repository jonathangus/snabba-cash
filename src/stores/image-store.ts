import create from 'zustand'
import { ImageEntity, Crop } from '../types'
import toast from '../utiils/toast'
import { uploadImage, generateVideo } from '../utiils/api'

type ImageStore = {
  files: Record<string, ImageEntity>
  addFile: (file: File) => void
  setCrop: (fileId: string, crop: Crop) => void
}

const defaultCrop = {
  aspect: 9 / 16,
  width: 500,
}

export const useImageStore = create<ImageStore>((set, get) => ({
  files: {},

  setCrop: (fileId, crop) => {
    set((state) => {
      const entity = state.files[fileId]

      return {
        files: {
          ...state.files,
          [entity.id]: {
            ...entity,
            crop,
          },
        },
      }
    })
  },

  addFile: async (file: File) => {
    const newEntity = {
      uploaded: false,
      original: file,
      id: file.name,
      crop: defaultCrop,
    }

    set((state) => ({
      files: {
        ...state.files,
        [newEntity.id]: newEntity,
      },
    }))

    // const response = await uploadImage(newEntity.original)

    // if (response.success) {
    //   set((state) => ({
    //     files: {
    //       ...state.files,
    //       [newEntity.id]: {
    //         ...state.files[newEntity.id],
    //         uploaded: true,
    //         imageUrl: response.imageUrl,
    //       },
    //     },
    //   }))
    // } else {
    //   console.error(response.error)
    //   set((state) => {
    //     toast.error('Could not upload image. Try again')
    //     const { [newEntity.id]: remove, ...files } = state.files
    //     return {
    //       files,
    //     }
    //   })
    // }
  },
}))
