import $api, { API_URL } from './04_Utils/axiosSetup'
import axios, { AxiosResponse } from 'axios'
import {
  LoginResponse,
  GetAllUsersResponse,
  Product,
  OrderFromAPI,
  User,
  GetAllOrdersResponse,
  GetAllProductsResponse,
  OrderToAPI,
  SurveysList,
  SurveyFromDB,
  UpdateProfile,
  TermsAndConditions,
} from './05_Types/APIResponse'
import { Survey } from './05_Types/01_Base'

export const API = {
  auth: {
    login: async (email: string, password: string) => {
      return $api.post<LoginResponse>('/login', { email, password })
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
      return axios.get<LoginResponse>(`${API_URL}/refresh`, { withCredentials: true })
    },
  },
  user: {
    getProfile: async (): Promise<AxiosResponse<User>> => {
      return $api.get<User>('/user/profile')
    },
    // TODO: endpoint
    getTermsAndConditions: async (lang: string): Promise<AxiosResponse<TermsAndConditions>> => {
      return $api.get<TermsAndConditions>(`/user/terms/${lang}`)
    },
    updateOwnProfile: async (formData: UpdateProfile) => {
      return $api.put<User>(`/user/profile`, formData)
    },
    myOrders: async (page: number, limit: number): Promise<AxiosResponse<any>> => {
      return $api.get<any>(`/order/myorders/${page}/${limit}`)
    },
    createReview: async (productId: string, review: any): Promise<void> => {
      return $api.post(`/product/${productId}/review`, { ...review })
    },
    toggleSubscription: async (email: string): Promise<void> => {
      return $api.post(`/user/subscription`, { email })
    },
  },
  order: {
    createOrder: async (newOrder: OrderToAPI): Promise<AxiosResponse<OrderFromAPI>> => {
      return $api.post<OrderFromAPI>('/order', newOrder)
    },
    payOrder: async (orderId: string, paymentResult: any): Promise<AxiosResponse<any>> => {
      return $api.post<any>(`/order/${orderId}/pay`, paymentResult)
    },
  },
  admin: {
    getApiInfo: async () => {
      return $api.get(`/apiinfo`)
    },
    getUser: async (userId: string): Promise<AxiosResponse<User>> => {
      return $api.get<User>(`admin/user/${userId}`)
    },
    getUsers: async (page: number, limit: number): Promise<AxiosResponse<GetAllUsersResponse>> => {
      return $api.get<GetAllUsersResponse>(`admin/user/${page}/${limit}`)
    },
    deleteUser: async (userId: string): Promise<void> => {
      return $api.delete(`admin/user/${userId}`)
    },
    updateProfileByAdmin: async (userId: string, formData: any): Promise<AxiosResponse<any>> => {
      return $api.put<any>(`admin/user/${userId}`, formData)
    },
    getSingleProduct: async (productId: string): Promise<AxiosResponse<Product>> => {
      return $api.get<Product>(`product/${productId}`)
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
    getSingleOrder: async (orderId: string): Promise<AxiosResponse<OrderFromAPI>> => {
      return $api.get<OrderFromAPI>(`order/${orderId}`)
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
    createSurvey: async (survey: Survey): Promise<void> => {
      return $api.post('admin/survey', { ...survey })
    },
    getSurveys: async (): Promise<AxiosResponse<SurveysList>> => {
      return $api.get<SurveysList>(`admin/survey/1/15`)
    },
    getSingleSurvey: async (surveyID: string): Promise<AxiosResponse<SurveyFromDB>> => {
      return $api.get<SurveyFromDB>(`admin/survey/${surveyID}`)
    },
    deleteSurvey: async (surveyId: string): Promise<void> => {
      return $api.delete(`admin/survey/${surveyId}`)
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
