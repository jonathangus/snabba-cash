import { useImageStore } from '../stores/image-store'
import { useVideoStore } from '../stores/video-store'

const SubmitButton = () => {
  const { files, uploadImages } = useImageStore(({ files, uploadImages }) => ({
    files,
    uploadImages,
  }))

  const generateVideo = useVideoStore((state) => state.generateVideo)

  return (
    <div>
      <button
        onClick={generateVideo}
        disabled={Object.keys(files).length === 0}
      >
        Send
      </button>
      {/* <button onClick={uploadImages} disabled={Object.keys(files).length === 0}>
        Upload
      </button> */}
    </div>
  )
}

export default SubmitButton
