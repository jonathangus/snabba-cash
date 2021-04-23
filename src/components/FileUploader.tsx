import React, { useCallback } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import styled from 'styled-components'
import config from '../config'
import { useImageStore } from '../stores/image-store'
import { getImageSizeFromFile } from '../utiils/image-utils'
import toast from '../utiils/toast'

const DropArea = styled.div<{ isDragActive: boolean }>`
  padding: 30px;
  background: grey;
  opacity: ${(props) => (props.isDragActive ? 0.5 : 1)};
`

const getFilesFromEvent = async (
  event: any
): Promise<(File | DataTransferItem)[]> => {
  const files: File[] = Array.from(
    event.dataTransfer ? event.dataTransfer.files : event.target.files || []
  )

  const promises = files.map(async (file) => {
    console.log(file.type)
    if (
      file.type == 'image/png' ||
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg'
    ) {
      const size = await getImageSizeFromFile(file)

      Object.defineProperty(file, 'imageSize', {
        value: size,
      })
    }

    return file
  })

  return await Promise.all(promises)
}

const validator: DropzoneOptions['validator'] = (file: any) => {
  let message

  if (!file.imageSize) {
    return null
  }

  switch (true) {
    case file.imageSize.width < config.fileConstraints.MIN_WIDTH:
    case file.imageSize.height < config.fileConstraints.MIN_HEIGHT:
      message = 'File is to small'
  }

  if (message) {
    return {
      code: 'file-to-small',
      message: `File is to small. It need to be minimum ${config.fileConstraints.MIN_WIDTH}px width and ${config.fileConstraints.MIN_HEIGHT}px height`,
    }
  }

  return null
}

const FileUploader = () => {
  const addFile = useImageStore((state) => state.addFile)
  const currentCount = useImageStore((state) => Object.keys(state.files).length)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles)
    if (currentCount >= config.MAX_FILES) {
      return toast.error(
        'Images was not added because you reached the maximum amount of images'
      )
    }
    acceptedFiles.forEach(addFile)
  }, [])

  const onDropRejected: DropzoneOptions['onDropRejected'] = (
    fileRejections,
    event
  ) => {
    console.log(fileRejections)
    fileRejections.forEach((rejection) => {
      rejection.errors.forEach((error) => {
        console.log(error.message)
        toast.error(`Reason: ${error.message}`, {
          title: 'One image failed to uploade',
        })
      })
    })
  }

  const {
    getRootProps,
    isDragReject,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    maxFiles: config.MAX_FILES,
    maxSize: config.MAX_FILE_SIZE,
    onDropRejected,
    validator,
    getFilesFromEvent,
    accept: '.jpeg,.jpg,.png',
  })

  console.log({ isDragReject })

  return (
    <div>
      <DropArea {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        {isDragReject && <p>Some files will be rejected</p>}
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag 'n' drop some files here, or click to select files. You need to
            upload a minumum of {config.MIN_FILES} and max {config.MAX_FILES}.
            Uploading many will make it go sloooow.
          </p>
        )}
      </DropArea>
    </div>
  )
}

export default FileUploader
