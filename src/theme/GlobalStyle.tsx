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
    position: relative;
  }

  .notifications-component  {
    top:0;
    left:0;
  }

  video, img {
    max-width:100%;
  }
`

export default GlobalStyle
