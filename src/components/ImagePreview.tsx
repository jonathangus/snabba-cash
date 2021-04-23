import * as React from 'react'
import { useRef } from 'react'
import { useCallback } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Crop, ImageEntity } from '../types'

type Props = {
  image?: ImageEntity
}

const Placeholder = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Image = styled.img<{ show: boolean }>`
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.show ? 1 : 0)};
  position: relative;
  z-index: 5;
  object-fit: cover;
  object-position: center;
  height: 100%;
  display: block;
  width: 100%;
`

const Wrapper = styled.div`
  height: 200px;
  position: relative;
`

const ImagePreview: React.FC<Props> = ({ image }) => {
  const [loaded, setLoaded] = useState(false)
  const previewUrl = useMemo(
    () => (image?.original ? URL.createObjectURL(image.original) : undefined),
    [image?.id]
  )

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      previewUrl && URL.revokeObjectURL(previewUrl)
    },
    [image?.id]
  )

  const onLoad = useCallback((img) => {
    console.log('loaded')
    setLoaded(true)
  }, [])

  return (
    <Wrapper>
      {previewUrl && <Image show={loaded} onLoad={onLoad} src={previewUrl} />}
      <Placeholder>
        <span>Upload image</span>
      </Placeholder>
    </Wrapper>
  )
}

export default ImagePreview
