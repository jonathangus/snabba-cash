import React, { useEffect } from 'react'
import { useVideoStore } from '../stores/video-store'
import FileUploader from './FileUploader'
import Grid from './Grid'
import ImagePreviews from './ImagePreviews'
import SubmitButton from './SubmitButton'
import TopArea from './TopArea'
import VideoPreview from './VideoPreview'
import { useRouter } from 'next/router'

const HomePage = () => {
  const { query } = useRouter()

  const { creating, videoUrl, fetchVideoFromId } = useVideoStore(
    ({ creating, videoUrl, fetchVideoFromId }) => ({
      creating,
      videoUrl,
      fetchVideoFromId,
    })
  )

  useEffect(() => {
    if (typeof query.id === 'string') {
      fetchVideoFromId(query.id)
    }
  }, [query.id])

  if (creating) {
    return (
      <div>
        <div>
          <video
            playsInline
            autoPlay
            src='https://media.giphy.com/media/3og0INAY5MLmEBubyU/giphy.mp4'
          />
        </div>
        <h1>loading....</h1>
      </div>
    )
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
