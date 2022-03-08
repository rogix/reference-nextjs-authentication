import { createContext, useState } from 'react'
import { authApi } from '../services/api'
import { setCookie } from 'nookies'

import Router from 'next/router'

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
  signIn(credentials: SignInCredentials): Promise<void>
  user: User
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>()

  const isAuthenticated = !!user

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

      await Router.push('/dashboard')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}
