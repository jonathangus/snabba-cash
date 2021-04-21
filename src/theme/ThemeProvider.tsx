import * as React from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

const ThemeProvider: React.FC = ({ children }) => (
  <SCThemeProvider theme={{}}>{children}</SCThemeProvider>
)

export default ThemeProvider
