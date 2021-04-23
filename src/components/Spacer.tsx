import styled from 'styled-components'

const Spacer = styled.div<{ size: number }>`
  height: ${(props) => props.theme.gutter * props.size}px;
`

export default Spacer
