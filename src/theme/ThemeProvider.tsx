import * as React from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

const theme = {
  backgroundColor: '#181818',
  gutter: 20,
}

type ThemeInterface = typeof theme

declare module 'styled-components' {
  interface DefaultTheme extends ThemeInterface {}
}

const ThemeProvider: React.FC = ({ children }) => (
  <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
)

export default ThemeProvider
