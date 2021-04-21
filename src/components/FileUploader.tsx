import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import { useImageStore } from '../stores/image-store'
import toast from '../utiils/toast'

const DropArea = styled.div<{ isDragActive: boolean }>`
  padding: 30px;
  background: grey;
  opacity: ${(props) => (props.isDragActive ? 0.5 : 1)};
`

const ONE_KB = 1000
const maxFiles = parseInt(process.env.NEXT_PUBLIC_MAX_COUNT_UPLOAD || '') || 10
const maxSize =
  parseInt(process.env.NEXT_PUBLIC_MAX_SIZE_UPLOAD || '') || 700 * ONE_KB

const FileUploader = () => {
  const addFile = useImageStore((state) => state.addFile)
  const currentCount = useImageStore((state) => Object.keys(state.files).length)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (currentCount >= maxFiles) {
      return toast.error(
        'Images was not added because you reached the maximum amount of images'
      )
    }
    acceptedFiles.forEach(addFile)
  }, [])

  const onDropRejected = () => {
    toast.error('Some images were not uploaded because they were to big')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    onDropRejected,
  })

  return (
    <div>
      <DropArea {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </DropArea>
    </div>
  )
}

export default FileUploader
