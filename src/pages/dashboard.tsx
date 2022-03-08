import { Box, Flex, Heading } from '@chakra-ui/react'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  return (
    <Box bg="gray.700" h="100vh" color="white">
      <Flex flexDirection="column" align="center" justify="center" h="100%">
        <Heading>Hello: {user?.email}</Heading>
      </Flex>
    </Box>
  )
}
