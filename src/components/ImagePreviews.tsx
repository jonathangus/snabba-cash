import * as React from 'react'
import styled from 'styled-components'

import { useImageStore } from '../stores/image-store'
import ImagePreview from './ImagePreview'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`

const ImagePreviews: React.FC = () => {
  const state = useImageStore((state) => ({
    files: state.files,
  }))

  const files = Object.values(state.files)

  if (!files.length) {
    return <div>'no images...'</div>
  }

  return (
    <Container>
      {files.map((file) => (
        <ImagePreview key={file.id} image={file} />
      ))}
    </Container>
  )
}

export default ImagePreviews
