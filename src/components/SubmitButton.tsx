import { useImageStore } from '../stores/image-store'

const SubmitButton = () => {
  const files = useImageStore((state) => state.files)

  return <button disabled={Object.keys(files).length === 0}>Send</button>
}

export default SubmitButton
