import $api, { API_URL } from '../04_Utils/axiosSetup'
import axios, { AxiosResponse } from 'axios'
import { AuthResponse, logoutResponse, registerResponse } from '../05_Types/APIResponse'

export const API = {
  auth: {
    login: async (email: string, password: string): Promise<AxiosResponse<AuthResponse>> => {
      return $api.post<AuthResponse>('/login', { email, password })
    },
    registration: async (name: string, email: string, password: string): Promise<AxiosResponse<registerResponse>> => {
      return $api.post<registerResponse>('/registration', { name, email, password })
    },
    logout: async (): Promise<AxiosResponse<logoutResponse>> => {
      return $api.post<logoutResponse>('/logout')
    },
    authenticate: async (): Promise<AxiosResponse<AuthResponse>> => {
      return axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })
    },
    googleOauth: async (): Promise<AxiosResponse<AuthResponse>> => {
      return axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true })
    },
  },
  user: {
    getProfile: async (): Promise<AxiosResponse<{}>> => {
      return $api.get<{}>('/user/profile')
    },
  },
}
