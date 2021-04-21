import { Crop } from '../types'

export const cropImage = async (file: File, crop: Crop, filename: string) => {
  const canvas = document.createElement('canvas')

  var image = new Image()
  image.height = 100
  image.title = file.name
  image.src = URL.createObjectURL(file)

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  canvas.width = crop.width
  canvas.height = crop.height

  console.log({ canvas })
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  // As Base64 string
  // const base64Image = canvas.toDataURL('image/jpeg');

  // As a blob
  const bl = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        blob.name = 'asdaaa'
        resolve(blob)
      },
      'image/jpeg',
      1
    )
  })

  console.log({ bl })

  return bl
}
