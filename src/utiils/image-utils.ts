import { Crop } from '../types'

const getImageFromUrl = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', reject)
    image.src = url
  })

export const cropImage = async (file: File, crop: Crop, filename: string) => {
  const canvas = document.createElement('canvas')

  var image = await getImageFromUrl(URL.createObjectURL(file))

  // const scaleX = image.naturalWidth / image.width
  const scaleX = 5.128205128205129
  // const scaleY = image.naturalHeight / image.height
  const scaleY = 5.12692307692307
  canvas.width = crop.width
  canvas.height = crop.height

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

  return bl
}
