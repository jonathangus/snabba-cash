import * as React from 'react'
import { memo } from 'react'

type Props = {
  url: string
}

const VideoPreview: React.FC<Props> = ({ url }) => {
  return (
    <video autoPlay controls>
      <source src={url} type='video/mp4' />
    </video>
  )
}

export default memo(VideoPreview)
