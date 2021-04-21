import { useImageStore } from '../stores/image-store'
import { useVideoStore } from '../stores/video-store'

const SubmitButton = () => {
  const files = useImageStore((state) => state.files)
  const generateVideo = useVideoStore((state) => state.generateVideo)

  return (
    <button onClick={generateVideo} disabled={Object.keys(files).length === 0}>
      Send
    </button>
  )
}

export default SubmitButton
