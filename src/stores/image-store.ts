import create from 'zustand'
import { ImageEntity } from '../types'
import toast from '../utiils/toast'
import { uploadImage } from '../utiils/api'

type ImageStore = {
  files: Record<string, ImageEntity>
  addFile: (file: File) => void
}

export const useImageStore = create<ImageStore>((set) => ({
  files: {},

  addFile: async (file: File) => {
    const newEntity = {
      uploaded: false,
      original: file,
      id: file.name,
    }

    set((state) => ({
      files: {
        ...state.files,
        [newEntity.id]: newEntity,
      },
    }))

    const response = await uploadImage(newEntity.original)

    if (response.success) {
      set((state) => ({
        files: {
          ...state.files,
          [newEntity.id]: {
            ...state.files[newEntity.id],
            uploaded: true,
            imageUrl: response.imageUrl,
          },
        },
      }))
    } else {
      console.error(response.error)
      set((state) => {
        toast.error('Could not upload image. Try again')
        const { [newEntity.id]: remove, ...files } = state.files
        return {
          files,
        }
      })
    }
  },
}))
