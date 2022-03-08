import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()
let isRefreshing = false // identifica se o token está sendo atualizado
let failedRequestQueue = []

export const authApi = axios.create({
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
        cookies = parseCookies()

        const { 'nextauth.refreshToken': refreshToken } = cookies
        const originalRequest = error.config

        if (!isRefreshing) {
          isRefreshing = true

          authApi
            .post('/refresh', { refreshToken })
            .then(response => {
              const { token } = response.data

              setCookie(undefined, 'nextauth.token', token, {
                maxAge: 30 * 24 * 60 * 60,
                path: '/',
              })

              setCookie(
                undefined,
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
      }
    }
  },
)
