import $api, { API_URL } from './04_Utils/axiosSetup'
import axios, { AxiosResponse } from 'axios'
import { LoginResponse, GetAllUsersResponse, Product, Order, User, GetAllOrdersResponse, GetAllProductsResponse } from './05_Types/APIResponse'

export const API = {
  auth: {
    login: async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
      return $api.post<LoginResponse>('/login', { email, password })
    },
    registration: async (email: string, password: string): Promise<AxiosResponse<never>> => {
      return $api.post<never>('/registration', { email, password })
    },
    logout: async (): Promise<AxiosResponse<never>> => {
      return $api.post<never>('/logout')
    },
    authenticate: async (): Promise<AxiosResponse<LoginResponse>> => {
      return axios.get<LoginResponse>(`${API_URL}/refresh`, { withCredentials: true })
    },
  },
  user: {
    getProfile: async (): Promise<AxiosResponse<any>> => {
      return $api.get<any>('/user/profile')
    },
  },
  config: {
    setColorTheme: async (): Promise<AxiosResponse<any>> => {
      // TODO:
      return $api.get<any>('/config/theme')
    },
  },
  admin: {
    getSingleUser: async (userId: string): Promise<AxiosResponse<User>> => {
      return $api.get<User>(`admin/user/${userId}`)
    },
    getUsers: async (page: number, limit: number): Promise<AxiosResponse<GetAllUsersResponse>> => {
      return $api.get<GetAllUsersResponse>(`admin/user/${page}/${limit}`)
    },
    deleteUser: async (userId: string): Promise<AxiosResponse<never>> => {
      return $api.delete<never>(`admin/user/${userId}`)
    },
    updateProfileByAdmin: async (userId: string, formData: any): Promise<AxiosResponse<any>> => {
      return $api.put<any>(`admin/user/${userId}`, formData)
    },
    getSingleProduct: async (productId: string): Promise<AxiosResponse<Product>> => {
      return $api.get<Product>(`product/${productId}`)
    },
    getProducts: async (page: number, limit: number): Promise<AxiosResponse<GetAllProductsResponse>> => {
      return $api.get<GetAllProductsResponse>(`product/${page}/${limit}`)
    },
    deleteProduct: async (productId: string): Promise<AxiosResponse<any>> => {
      return $api.delete<any>(`admin/product/${productId}`)
    },
    getSingleOrder: async (orderId: string): Promise<AxiosResponse<Order>> => {
      return $api.get<Order>(`order/${orderId}`)
    },
    getOrders: async (page: number, limit: number): Promise<AxiosResponse<GetAllOrdersResponse>> => {
      return $api.get<GetAllOrdersResponse>(`admin/order/${page}/${limit}`)
    },
  },
}
