import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import type { GetServerSideProps, NextPage } from 'next'
import { parseCookies } from 'nookies'
import { useContext, useState } from 'react'
import { Header } from '../components/Header/Header'
import { AuthContext } from '../contexts/AuthContext'

const Home: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { signIn } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email === ' ' || password === ' ') {
      setError('Please fill in all fields')
    } else {
      setError('')
    }

    const data = {
      email,
      password,
    }

    await signIn(data)
  }

  return (
    <Flex
      h="100vh"
      color={'white'}
      bg="gray.800"
      align="center"
      justify="center"
      alignContent="center"
      flexDirection="column"
    >
      <Box bg="gray.900" p="50px" borderRadius={20}>
        <form onSubmit={handleSubmit}>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              mb="20px"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              mb="20px"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              colorScheme="blackAlpha"
              onClick={() => setError('error')}
            >
              Entrar
            </Button>
          </FormControl>
        </form>
      </Box>
    </Flex>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = parseCookies(ctx)

  if (cookies['nextauth.token']) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
