import * as React from 'react'
import { memo } from 'react'
import styled from 'styled-components'
import { useUploadStore } from '../stores/upload-store'

type Props = {}

const VideoContainer = styled.div`
  max-width: 800px;
`

const VideoPreview: React.FC<Props> = () => {
  const videoUrl = useUploadStore((state) => state.videoUrl)
  if (!videoUrl) {
    return <div>waiting...</div>
  }

  return (
    <VideoContainer>
      <video autoPlay controls>
        <source src={videoUrl} type='video/mp4' />
      </video>
    </VideoContainer>
  )
}

export default memo(VideoPreview)
