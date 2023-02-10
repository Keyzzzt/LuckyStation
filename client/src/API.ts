import $api, { API_URL } from './04_Utils/axiosSetup'
import axios, { AxiosResponse } from 'axios'
import {
  LoginResponseType,
  UsersListResponseType,
  ProductResponseType,
  OrderResponseType,
  UserResponseType,
  GetAllOrdersResponse,
  GetAllProductsResponse,
  OrderCreateRequestType,
  UpdateProfileRequestType,
  TermsAndConditionsResponseType,
  ConfigResponseType, GalleryListResponseType,
} from './05_Types/ResponseTypes'
import { GalleryListItemType } from './03_Reducers/gallery/galleryReducer'
import { UpdateData } from './03_Reducers/gallery/editGalleryItemReducer'

export const API = {
  config: {
    getConfig: async () => {
      return $api.get<ConfigResponseType>('/config')
    },
  },
  auth: {
    login: async (email: string, password: string) => {
      return $api.post<LoginResponseType>('/login', { email, password })
    },
    // No data in response, test for response status
    registration: async (email: string, password: string) => {
      return $api.post('/registration', { email, password })
    },
    // No data in response, test for response status
    logout: async (): Promise<void> => {
      return $api.post('/logout')
    },
    authenticate: async () => {
      return axios.get<LoginResponseType>(`${API_URL}/refresh`, { withCredentials: true })
    },
  },
  user: {
    getProfile: async (): Promise<AxiosResponse<UserResponseType>> => {
      return $api.get<UserResponseType>('/user/profile')
    },
    // TODO: endpoint
    getTermsAndConditions: async (lang: string): Promise<AxiosResponse<TermsAndConditionsResponseType>> => {
      return $api.get<TermsAndConditionsResponseType>(`/user/terms/${lang}`)
    },
    updateOwnProfile: async (formData: UpdateProfileRequestType) => {
      return $api.put<UserResponseType>(`/user/profile`, formData)
    },
    myOrders: async (page: number, limit: number): Promise<AxiosResponse<any>> => {
      return $api.get<any>(`/order/myorders/${page}/${limit}`)
    },
    createReview: async (productId: string, review: any): Promise<void> => {
      return $api.post(`/product/${productId}/review`, { ...review })
    },
    subscribe: async (email: string): Promise<void> => {
      return $api.post(`/user/subscribe`, { email })
    },
  },
  order: {
    createOrder: async (newOrder: OrderCreateRequestType): Promise<AxiosResponse<string>> => {
      return $api.post<string>('/order', newOrder)
    },
    payOrder: async (orderId: string, paymentResult: any): Promise<AxiosResponse<any>> => {
      return $api.post<any>(`/order/${orderId}/pay`, paymentResult)
    },
  },
  admin: {
    getApiInfo: async () => {
      return $api.get(`/apiinfo`)
    },
    getUser: async (userId: string): Promise<AxiosResponse<UserResponseType>> => {
      return $api.get<UserResponseType>(`admin/user/${userId}`)
    },
    getUsers: async (page: number, limit: number): Promise<AxiosResponse<UsersListResponseType>> => {
      return $api.get<UsersListResponseType>(`admin/user/${page}/${limit}`)
    },
    getGalleryList: async (): Promise<AxiosResponse<GalleryListResponseType>> => {
      return $api.get<GalleryListResponseType>(`gallery`)
    },
    getGalleryItem: async (itemId: string): Promise<AxiosResponse<GalleryListItemType>> => {
      return $api.get<GalleryListItemType>(`gallery/${itemId}`)
    },
    editGalleryItem: async (updateData: UpdateData, itemId: string): Promise<AxiosResponse<GalleryListItemType>> => {
      return $api.put<GalleryListItemType>(`admin/gallery/${itemId}`, updateData)
    },
    deleteUser: async (userId: string): Promise<void> => {
      return $api.delete(`admin/user/${userId}`)
    },
    updateProfileByAdmin: async (userId: string, formData: any): Promise<AxiosResponse<any>> => {
      return $api.put<any>(`admin/user/${userId}`, formData)
    },
    getSingleProduct: async (productId: string): Promise<AxiosResponse<ProductResponseType>> => {
      return $api.get<ProductResponseType>(`product/${productId}`)
    },
    getProducts: async (
      keyword: string,
      page: number,
      limit: number
    ): Promise<AxiosResponse<GetAllProductsResponse>> => {
      return $api.get<GetAllProductsResponse>(`product/${page}/${limit}?keyword=${keyword}`)
    },
    deleteProduct: async (productId: string): Promise<AxiosResponse<any>> => {
      return $api.delete<any>(`admin/product/${productId}`)
    },
    createProduct: async (product: any): Promise<AxiosResponse<any>> => {
      return $api.post<any>(`admin/product`, { ...product })
    },
    updateProduct: async (productId: string, product: any): Promise<AxiosResponse<any>> => {
      return $api.put<any>(`admin/product/${productId}`, { ...product })
    },
    getSingleOrder: async (orderId: string): Promise<AxiosResponse<OrderResponseType>> => {
      return $api.get<OrderResponseType>(`order/${orderId}`)
    },
    getOrders: async (page: number, limit: number): Promise<AxiosResponse<GetAllOrdersResponse>> => {
      return $api.get<GetAllOrdersResponse>(`admin/order/${page}/${limit}`)
    },
    setToDelivered: async (orderId: string): Promise<void> => {
      return $api.post(`/admin/order/${orderId}/delivered`)
    },
    setToNotDelivered: async (orderId: string): Promise<void> => {
      return $api.delete(`admin/order/${orderId}/delivered`)
    },
    setToPaid: async (orderId: string): Promise<void> => {
      return $api.post(`admin/order/${orderId}/pay`)
    },
    setToNotPaid: async (orderId: string): Promise<void> => {
      return $api.delete(`admin/order/${orderId}/pay`)
    },
    deleteOrder: async (orderId: string): Promise<void> => {
      return $api.delete(`admin/order/${orderId}/delete`)
    },
    getStatistic: async (): Promise<AxiosResponse<any>> => {
      return $api.get<any>(`admin/statistic`)
    },
    removeEmailFromList: async (email: string): Promise<void> => {
      return $api.put('admin/statistic/email', { email })
    },
  },
  product: {
    toggleFavorite: async (productId: string, isFavorite: boolean): Promise<void> => {
      if (!isFavorite) {
        return $api.post(`user/favorite/${productId}`)
      } else {
        return $api.delete(`user/favorite/${productId}`)
      }
    },
  },
}
