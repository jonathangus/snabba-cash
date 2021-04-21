import * as React from 'react'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import GlobalStyle from '../theme/GlobalStyle'
import ThemeProvider from '../theme/ThemeProvider'

type Props = {
  Component: any
  pageProps: any
}

const App: React.FC<Props> = ({ Component, pageProps }) => (
  <>
    <GlobalStyle />
    <ThemeProvider>
      <div className='app-container'>
        <Component {...pageProps} />
        <ReactNotification />
      </div>
    </ThemeProvider>
  </>
)

export default App
