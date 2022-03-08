import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'

import '@fontsource/open-sans/400.css'

import type { AppProps } from 'next/app'

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../../mocks')
}

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
