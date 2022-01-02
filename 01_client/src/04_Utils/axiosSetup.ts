import axios from 'axios'
import { LoginResponse } from '../05_Types/APIResponse'

export const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

$api.interceptors.request.use((config) => {
  // @ts-ignore
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})
$api.interceptors.response.use(
  (config) => {
    return config
  },
  async (err) => {
    const originalRequest = err.config
    if (err.response.status === 401 && err.config && !err.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const { data } = await axios.get<LoginResponse>(`${API_URL}/refresh`, { withCredentials: true })
        localStorage.setItem('token', data.accessToken)
        return $api.request(originalRequest)
      } catch (error) {
        console.log('Interceptor - Not Authorized')
      }
    }
    throw err
  }
)

export default $api
