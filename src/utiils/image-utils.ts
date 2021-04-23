import { Crop } from '../types'

export const getImageSizeFromFile = (
  file: File
): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const fr = new FileReader()

    console.log(file)
    fr.onload = () => {
      const img = new Image()

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
        })
      }

      setTimeout(() => {
        resolve({ height: 0, width: 0 })
      }, 10000)

      if (fr.result) {
        img.src = fr.result as string
      }
    }

    fr.readAsDataURL(file)
  })

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
  const scaleX = crop.scaleX
  // const scaleY = image.naturalHeight / image.height
  const scaleY = crop.scaleY
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
