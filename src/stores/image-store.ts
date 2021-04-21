import create from 'zustand'
import { ImageEntity, Crop } from '../types'
import toast from '../utiils/toast'
import { uploadImage, generateVideo } from '../utiils/api'
import { cropImage } from '../utiils/image-utils'

type ImageStore = {
  files: Record<string, ImageEntity>
  addFile: (file: File) => void
  setCrop: (fileId: string, crop: Crop) => void
}

const defaultCrop = {
  aspect: 9 / 16,
  width: 1080,
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

    images.forEach((image) => {
      uploadImage(image.fff)
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
