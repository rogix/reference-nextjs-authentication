import { createContext, ReactNode, useState } from 'react'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

import Router from 'next/router'
import { useEffect } from 'react'
import { authApi } from '../services/apiClient'

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => void
  user: User
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

let authChanel: BroadcastChannel

export function signOut() {
  destroyCookie(null, 'nextauth.token')
  destroyCookie(null, 'nextauth.refreshToken')

  authChanel.postMessage('signOut')

  Router.push('/')
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()

  const isAuthenticated = !!user

  useEffect(() => {
    authChanel = new BroadcastChannel('auth')

    authChanel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut()
          break
        default:
          break
      }
    }
  }, [])

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()

    if (token) {
      authApi
        .get<User>('/me')
        .then(response => {
          const { email, permissions, roles } = response.data

          setUser({ email, permissions, roles })
        })
        .catch(() => {
          signOut()
        })
    }
  }, [])

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const response = await authApi.post('/sessions', { email, password })

      const { token, refreshToken, permissions, roles } = response.data

      setCookie(null, 'nextauth.token', token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      setCookie(null, 'nextauth.refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })

      setUser({
        email,
        permissions,
        roles,
      })

      authApi.defaults.headers['Authorization'] = `Bearer ${token}`

      await Router.push('/dashboard')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
