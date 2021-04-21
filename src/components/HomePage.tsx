import React from 'react'
import FileUploader from './FileUploader'
import ImagePreviews from './ImagePreviews'
import SubmitButton from './SubmitButton'

const HomePage = () => (
  <div>
    <FileUploader />
    <ImagePreviews />

    <SubmitButton />
  </div>
)

export default HomePage
