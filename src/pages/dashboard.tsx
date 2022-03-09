import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { useContext, useEffect } from 'react'
import { Can } from '../components/Can'
import { AuthContext } from '../contexts/AuthContext'
import { setupAPIClient } from '../services/api'
import { authApi } from '../services/apiClient'
import { withSSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext)

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

        <Can permissions={['metrics.list']}>
          <p>You can see metrics</p>
        </Can>

        <Button onClick={signOut} colorScheme="blackAlpha" mt={20}>
          Sign out
        </Button>
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
