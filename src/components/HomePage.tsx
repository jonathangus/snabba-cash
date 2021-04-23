import React from 'react'
import { useVideoStore } from '../stores/video-store'
import FileUploader from './FileUploader'
import Grid from './Grid'
import ImagePreviews from './ImagePreviews'
import SubmitButton from './SubmitButton'
import TopArea from './TopArea'
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
    <Grid>
      <TopArea />
      <FileUploader />
      <ImagePreviews />
      <SubmitButton />
    </Grid>
  )
}
export default HomePage
