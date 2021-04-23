import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background: ${(props) => props.theme.backgroundColor}
  }


  .app-container {
    min-height: 100vh;
  }

  video, img {
    max-width:100%;
  }
`

export default GlobalStyle
