import * as React from 'react'
import styled from 'styled-components'
import FileUploader from './FileUploader'
import Grid from './Grid'
import ImagePreviews from './ImagePreviews'
import SubmitButton from './SubmitButton'
import TopArea from './TopArea'

const Container = styled.div`
  position: relative;
`
const Wrapper = styled.div`
  display: flex;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const Sidebar = styled.div`
  width: 300px;

  @media (max-width: 500px) {
    width: auto;
    order: 2;
    padding: ${(props) => props.theme.gutter * 2}px;
  }
`

const Sticky = styled.div`
  position: sticky;
  top: 0px;
`

const Inner = styled.div`
  flex: 1;
  position: relative;
  margin-left: ${(props) => props.theme.gutter}px;
  margin-right: ${(props) => props.theme.gutter}px;
`

const Main: React.FC = () => {
  return (
    <Container>
      <Wrapper>
        <Sidebar>
          <ImagePreviews />
        </Sidebar>
        <Inner>
          <Sticky>
            <TopArea />
            <FileUploader />
            <SubmitButton />
          </Sticky>
        </Inner>
      </Wrapper>
    </Container>
  )
}

export default Main
