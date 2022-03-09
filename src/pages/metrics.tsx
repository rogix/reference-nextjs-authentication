import { Box, Flex, Heading } from '@chakra-ui/react'
import { setupAPIClient } from '../services/api'
import { withSSRAuth } from '../utils/withSSRAuth'
import decode from 'jwt-decode'

export default function Metrics() {
  return (
    <Box bg="gray.700" h="100vh" color="white">
      <Flex flexDirection="column" align="center" justify="center" h="100%">
        <Heading>Metrics</Heading>
      </Flex>
    </Box>
  )
}

export const getServerSideProps = withSSRAuth(
  async ctx => {
    const apiClient = setupAPIClient(ctx)

    const response = await apiClient.get('/me')

    return {
      props: {},
    }
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  },
)
