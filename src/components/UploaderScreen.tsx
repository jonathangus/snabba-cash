import styled, { keyframes } from 'styled-components'
import { UploadProgress } from '../enums'
import { useUploadStore } from '../stores/upload-store'
import Spacer from './Spacer'

const flipKeyframs = keyframes`
  {
    0% {
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    }
    50% {
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    } 100% {
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    background-color: #ec407a;
    } 
`

const LoadBox = styled.div`
  width: 100px;
  height: 100px;
  background-color: #42a5f5;
  margin: 100px auto;
  -webkit-animation: ${flipKeyframs} 1.2s infinite ease-in-out;
  animation: ${flipKeyframs} 1.2s infinite ease-in-out;
`

const Boom = styled.div`
  background-color: white;
  padding: 10px;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const UploaderScreen = () => {
  const { status, progress } = useUploadStore((store) => ({
    status: store.status,
    progress: store.progress,
  }))

  let node = (
    <div>
      {status} - {progress}%
    </div>
  )

  if (status === UploadProgress.WAITING_RESPONSE) {
    node = (
      <div>
        Waiting for creation of video. This can take a couple of minutes.
      </div>
    )
  }

  return (
    <Container>
      <Spacer size={2} />
      <LoadBox />

      <Boom>{node}</Boom>

      <Spacer size={2} />
    </Container>
  )
}

export default UploaderScreen
