import * as React from 'react'
import { useState } from 'react'
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

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(previewUrl)
    },
    [image.id]
  )

  // const [crop, setCrop] = useState({ aspect: 9 / 16 })

  return (
    <ReactCrop
      src={previewUrl}
      crop={image.crop}
      onChange={(newCrop: Crop) => setCrop(image.id, newCrop)}
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
