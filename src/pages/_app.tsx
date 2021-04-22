import * as React from 'react'
import { useEffect } from 'react'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import GlobalStyle from '../theme/GlobalStyle'
import ThemeProvider from '../theme/ThemeProvider'
import 'react-image-crop/dist/ReactCrop.css'
import apiService from '../services/api-service'

type Props = {
  Component: any
  pageProps: any
}

const App: React.FC<Props> = ({ Component, pageProps }) => {
  useEffect(() => {
    apiService.getPresign()
  }, [])

  return (
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
}

export default App
