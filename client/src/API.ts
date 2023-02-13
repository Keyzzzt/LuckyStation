import $api, { API_URL } from './04_Utils/axiosSetup'
import axios from 'axios'
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
  TermsAndConditionsResponseType, ConfigResponseType,
} from './05_Types/ResponseTypes'
import { GalleryListItemType } from './03_Reducers/gallery/galleryReducer'
import { UpdateData } from './03_Reducers/gallery/editGalleryItemReducer'
import { AddGalleryItemType } from './03_Reducers/gallery/addGalleryItemReducer'
import { ToggleAdminStatusType } from './03_Reducers/admin/toggleAdminStatusReducer'

export const API = {
  config: {
    getConfig: async () => {
      return $api.get<ConfigResponseType>('/config')
    },
  },
  auth: {
    signIn: async (email: string, password: string) => {
      return $api.post<LoginResponseType>('/login', { email, password })
    },
    registration: async (email: string, password: string) => {
      return $api.post('/registration', { email, password })
    },
    logout: async () => {
      return $api.post('/logout')
    },
    authenticate: async () => {
      return axios.get<LoginResponseType>(`${API_URL}/refresh`, { withCredentials: true })
    },
  },
  user: {
    getProfile: async () => {
      return $api.get<UserResponseType>('/user/profile')
    },
    getTermsAndConditions: async (lang: string) => {
      return $api.get<TermsAndConditionsResponseType>(`/user/terms/${lang}`)
    },
    updateOwnProfile: async (formData: UpdateProfileRequestType) => {
      return $api.put<UserResponseType>(`/user/profile`, formData)
    },
    myOrders: async (page: number, limit: number) => {
      return $api.get<any>(`/order/myorders/${page}/${limit}`)
    },
    createReview: async (productId: string, review: any) => {
      return $api.post(`/product/${productId}/review`, { ...review })
    },
    subscribe: async (email: string) => {
      return $api.post(`/user/subscribe`, { email })
    },
  },
  order: {
    createOrder: async (newOrder: OrderCreateRequestType) => {
      return $api.post<string>('/order', newOrder)
    },
    payOrder: async (orderId: string, paymentResult: any) => {
      return $api.post<any>(`/order/${orderId}/pay`, paymentResult)
    },
  },
  admin: {
    getApiInfo: async () => {
      return $api.get(`/apiinfo`)
    },
    getUser: async (userId: string) => {
      return $api.get<UserResponseType>(`admin/user/${userId}`)
    },
    getUsers: async (page: number, limit: number) => {
      return $api.get<UsersListResponseType>(`admin/user/${page}/${limit}`)
    },
    getGalleryList: async () => {
      return $api.get<GalleryListItemType[]>(`gallery`)
    },
    getGalleryItem: async (itemId: string) => {
      return $api.get<GalleryListItemType>(`gallery/${itemId}`)
    },
    editGalleryItem: async (updateData: UpdateData, itemId: string) => {
      return $api.put<GalleryListItemType>(`admin/gallery/${itemId}`, updateData)
    },
    addGalleryItem: async (newImage: AddGalleryItemType) => {
      return $api.post(`admin/gallery`, newImage)
    },
    deleteGalleryItem: async (itemId: string)=> {
      return $api.delete(`admin/gallery/${itemId}`)
    },
    deleteUser: async (userId: string) => {
      return $api.delete(`admin/user/${userId}`)
    },

    toggleAdminStatus: async (userId: string, status: ToggleAdminStatusType) => {
      return $api.put<any>(`admin/user/${userId}`, status)
    },

    getSingleProduct: async (productId: string) => {
      return $api.get<ProductResponseType>(`product/${productId}`)
    },
    getProducts: async (
      keyword: string,
      page: number,
      limit: number
    ) => {
      return $api.get<GetAllProductsResponse>(`product/${page}/${limit}?keyword=${keyword}`)
    },
    deleteProduct: async (productId: string) => {
      return $api.delete<any>(`admin/product/${productId}`)
    },
    createProduct: async (product: any) => {
      return $api.post<any>(`admin/product`, { ...product })
    },
    updateProduct: async (productId: string, product: any) => {
      return $api.put<any>(`admin/product/${productId}`, { ...product })
    },
    getSingleOrder: async (orderId: string) => {
      return $api.get<OrderResponseType>(`order/${orderId}`)
    },
    getOrders: async (page: number, limit: number) => {
      return $api.get<GetAllOrdersResponse>(`admin/order/${page}/${limit}`)
    },
    setToDelivered: async (orderId: string) => {
      return $api.post(`/admin/order/${orderId}/delivered`)
    },
    setToNotDelivered: async (orderId: string) => {
      return $api.delete(`admin/order/${orderId}/delivered`)
    },
    setToPaid: async (orderId: string) => {
      return $api.post(`admin/order/${orderId}/pay`)
    },
    setToNotPaid: async (orderId: string) => {
      return $api.delete(`admin/order/${orderId}/pay`)
    },
    deleteOrder: async (orderId: string) => {
      return $api.delete(`admin/order/${orderId}`)
    },
    getStatistic: async () => {
      return $api.get<any>(`admin/statistic`)
    },
    removeEmailFromList: async (email: string) => {
      return $api.put<void>('admin/statistic/email', { email })
    },
  },
  product: {
    toggleFavorite: async (productId: string, isFavorite: boolean) => {
      if (!isFavorite) {
        return $api.post(`user/favorite/${productId}`)
      } else {
        return $api.delete(`user/favorite/${productId}`)
      }
    },
  },
}
