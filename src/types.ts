export type ImageEntity = {
  original: File
  uploaded: boolean
  id: string
  imageUrl?: string
  crop: Crop
}

export type Crop = {
  aspect: number
  height: number
  unit: '%'
  width: number
  x: number
  y: number
}
