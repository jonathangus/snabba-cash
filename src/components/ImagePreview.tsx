import * as React from 'react'
import { useRef } from 'react'
import { useCallback } from 'react'
import ReactCrop from 'react-image-crop'
import { useEffect, useMemo } from 'react'
import { Crop, ImageEntity } from '../types'
import { useImageStore } from '../stores/image-store'

type Props = {
  image: ImageEntity
}

const ImagePreview: React.FC<Props> = ({ image }) => {
  const previewUrl = useMemo(() => URL.createObjectURL(image.original), [
    image.id,
  ])

  const setCrop = useImageStore((state) => state.setCrop)
  const imgRef = useRef()
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(previewUrl)
    },
    [image.id]
  )

  const onLoad = useCallback((img) => {
    imgRef.current = img

    return true // Return false if you set crop state in here.
  }, [])

  // useEffect(() => {
  //   const scaleX = imgRef.current.naturalWidth / imgRef.current.width
  //   console.log(imgRef.current.naturalHeight / imgRef.current.height)
  // }, [image.crop])

  // // const [crop, setCrop] = useState({ aspect: 9 / 16 })

  const updateCrop = (newCrop: Crop) => {
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    // console.log(
    //   newCrop,
    //   {
    //     scaleX,
    //     scaleY,
    //   },
    //   imgRef.current.naturalWidth,
    //   imgRef.current.width
    // )
    // setCrop(image.id, { ...newCrop, scaleX, scaleY })
    setCrop(newCrop)
  }

  return (
    <ReactCrop
      ref={imgRef}
      src={previewUrl}
      crop={image.crop}
      onImageLoaded={onLoad}
      onChange={updateCrop}
    />
  )

  return (
    <div>
      <img src={previewUrl} />
      {!image.uploaded && 'laddar upp...'}
    </div>
  )
}

export default ImagePreview
