import * as React from 'react'
import { memo } from 'react'
import styled from 'styled-components'

type Props = {
  url: string
}

const VideoContainer = styled.div`
  max-width: 800px;
`

const VideoPreview: React.FC<Props> = ({ url }) => {
  if (!url) {
    return <div>waiting...</div>
  }
  return (
    <VideoContainer>
      <video autoPlay controls>
        <source src={url} type='video/mp4' />
      </video>
    </VideoContainer>
  )
}

export default memo(VideoPreview)
