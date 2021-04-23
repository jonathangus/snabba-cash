import * as React from 'react'
import styled from 'styled-components'
import config from '../config'

import { useImageStore } from '../stores/image-store'
import { ImageEntity } from '../types'
import ImagePreview from './ImagePreview'

const Container = styled.div`
  display: grid;
  gap: ${(props) => props.theme.gutter}px;
`

const Item = styled.div``

const ImagePreviews: React.FC = () => {
  const files = useImageStore((state) => state.files)

  const gotPlaceholder = files.length <= config.MIN_FILES
  const items: ImageEntity[] = gotPlaceholder
    ? Array(config.MIN_FILES).fill(0)
    : files

  console.log({ items })
  return (
    <Container>
      {items.map((item, index) => (
        <Item key={files[index]?.id || index}>
          <ImagePreview image={files[index]} />
        </Item>
      ))}
    </Container>
  )
}

export default ImagePreviews
