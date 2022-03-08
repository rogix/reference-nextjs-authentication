import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'

import '@fontsource/open-sans/400.css'

import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../../mocks')
}

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
