import axios from 'axios'
import { parseCookies } from 'nookies'

const cookies = parseCookies()

export const authApi = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${cookies['nextauth.token']}`,
  },
})
