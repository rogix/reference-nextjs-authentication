import { Box, Flex, Heading } from '@chakra-ui/react'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { authApi } from '../services/api'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    authApi
      .get('/me')
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(response)
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error)
      })
  }, [])

  return (
    <Box bg="gray.700" h="100vh" color="white">
      <Flex flexDirection="column" align="center" justify="center" h="100%">
        <Heading>Hello: {user?.email}</Heading>
      </Flex>
    </Box>
  )
}
