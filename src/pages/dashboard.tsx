import { Box, Flex, Heading } from '@chakra-ui/react'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useCan } from '../hooks/useCan'
import { setupAPIClient } from '../services/api'
import { authApi } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  const useCanSeeMetrics = useCan({
    permissions: ['metrics.list'],
  })

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

        {useCanSeeMetrics && <p>You can see metrics</p>}
      </Flex>
    </Box>
  )
}

export const getServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupAPIClient(ctx)

  const response = await apiClient.get('/me')

  return {
    props: {},
  }
})
