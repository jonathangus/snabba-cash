import styled from 'styled-components'
import Spacer from './Spacer'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`

const Image = styled.img``

const ImageWrapper = styled.div`
  position: relative;
  width: 400px;
  height: 80px;
`

const TopArea = () => {
  return (
    <Container>
      <Spacer size={2} />
      <ImageWrapper>
        <Image
          layout='fill'
          alt='logo'
          src='/images/logo.png'
          objectFit='contain'
        />
      </ImageWrapper>

      <Spacer size={2} />
    </Container>
  )
}

export default TopArea
