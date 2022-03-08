import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'
import { AuthTokenError } from './errors/AuthTokenError'

let isRefreshing = false // identifica se o token está sendo atualizado
let failedRequestQueue = []

export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx)

  const authApi = axios.create({
    baseURL: 'http://localhost:3333',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${cookies['nextauth.token']}`,
    },
  })

  authApi.interceptors.response.use(
    response => {
      return response
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(ctx)

          const { 'nextauth.refreshToken': refreshToken } = cookies
          const originalRequest = error.config

          if (!isRefreshing) {
            isRefreshing = true

            authApi
              .post('/refresh', { refreshToken })
              .then(response => {
                const { token } = response.data

                setCookie(ctx, 'nextauth.token', token, {
                  maxAge: 30 * 24 * 60 * 60,
                  path: '/',
                })

                setCookie(
                  ctx,
                  'nextauth.refreshToken',
                  response.data.refreshToken,
                  {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                  },
                )

                authApi.defaults.headers['Authorization'] = `Bearer ${token}`

                failedRequestQueue.forEach(req => {
                  req.onSucess(token)
                })

                failedRequestQueue = []
              })
              .catch(err => {
                failedRequestQueue.forEach(req => {
                  req.onFailure(err)
                })

                failedRequestQueue = []

                if (process.browser) {
                  signOut()
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSucess: (token: string) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`

                resolve(authApi(originalRequest))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              },
            })
          })
        } else {
          if (process.browser) {
            signOut()
          } else {
            return Promise.reject(
              new AuthTokenError(error.response.data.message),
            )
          }
        }
      }

      return Promise.reject(error)
    },
  )

  return authApi
}
