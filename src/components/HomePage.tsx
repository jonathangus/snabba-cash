import React, { useEffect } from 'react'
import { useUploadStore } from '../stores/upload-store'
import Main from './Main'
import VideoPreview from './VideoPreview'
import { useRouter } from 'next/router'
import { UploadProgress } from '../enums'
import UploaderScreen from './UploaderScreen'

const HomePage = () => {
  const { query } = useRouter()
  const { status, fetchVideoFromId } = useUploadStore(
    ({ fetchVideoFromId, status }) => ({
      status,
      fetchVideoFromId,
    })
  )

  useEffect(() => {
    if (typeof query.id === 'string') {
      fetchVideoFromId(query.id)
    }
  }, [query.id])

  if (status === UploadProgress.NOT_STARTED) {
    return <Main />
  }

  if (status === UploadProgress.COMPLETE) {
    return <VideoPreview />
  }

  return <UploaderScreen />
}
export default HomePage
