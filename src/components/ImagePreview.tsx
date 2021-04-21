import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { ImageEntity } from '../types'

type Props = {
  image: ImageEntity
}
const ImagePreview: React.FC<Props> = ({ image }) => {
  const previewUrl = useMemo(() => URL.createObjectURL(image.original), [
    image.id,
  ])

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      URL.revokeObjectURL(previewUrl)
    },
    [image.id]
  )

  return (
    <div>
      <img src={previewUrl} />
      {!image.uploaded && 'laddar upp...'}
    </div>
  )
}

export default ImagePreview
