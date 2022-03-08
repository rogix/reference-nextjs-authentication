import { extendTheme } from '@chakra-ui/react'

const fonts = {
  heading: 'Open Sans, sans-serif',
  body: 'Open Sans, sans-serif',
}

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

export const theme = extendTheme({ colors, fonts })
