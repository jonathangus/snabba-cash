import { useImageStore } from '../stores/image-store'
import { useUploadStore } from '../stores/upload-store'
import Spacer from './Spacer'

const SubmitButton = () => {
  const canUpload = useImageStore((store) => store.canUpload)
  const generateVideo = useUploadStore((state) => state.generateVideo)

  return (
    <div>
      <Spacer size={4} />
      <button onClick={generateVideo} disabled={!canUpload}>
        Send
      </button>
      {/* <button onClick={uploadImages} disabled={Object.keys(files).length === 0}>
        Upload
      </button> */}
    </div>
  )
}

export default SubmitButton
