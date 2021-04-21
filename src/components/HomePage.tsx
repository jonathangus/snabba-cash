import React from 'react'
import { useVideoStore } from '../stores/video-store'
import FileUploader from './FileUploader'
import ImagePreviews from './ImagePreviews'
import SubmitButton from './SubmitButton'
import VideoPreview from './VideoPreview'

const HomePage = () => {
  const { creating, videoUrl } = useVideoStore(({ creating, videoUrl }) => ({
    creating,
    videoUrl,
  }))

  if (creating) {
    return <div>loading....</div>
  }

  if (videoUrl) {
    return <VideoPreview url={videoUrl} />
  }

  return (
    <div>
      <FileUploader />
      <ImagePreviews />
      <SubmitButton />
    </div>
  )
}
export default HomePage
