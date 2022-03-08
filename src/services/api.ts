import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'

let cookies = parseCookies()

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
      if (error.response?.data.code === 'token.expired') {
        cookies = parseCookies()

        const { 'nextauth.refreshToken': refreshToken } = cookies

        authApi.post('/refresh', { refreshToken }).then(response => {
          const { token } = response.data

          setCookie(null, 'nextauth.token', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          })

          setCookie(null, 'nextauth.refreshToken', response.data.refreshToken, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
          })

          authApi.defaults.headers['Authorization'] = `Bearer ${token}`
        })
      } else {
      }
    }
  },
)
