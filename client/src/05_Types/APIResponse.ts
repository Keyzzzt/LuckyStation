export interface LoginResponse {
  accessToken: string
  _id: string
}

// export interface ErrorResponse {
//   error: string
//   errors: string[]
// }

export type User = {
  accessToken?: string
  _id: string
  name: string
  email: string
  logo: string
  phone: string
  isAdmin: boolean
  isSubscribed: boolean
  isActivated: boolean
  favorite: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UpdateProfile {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}

export type UserTypeForList = {
  _id: string
  email: string
  isAdmin: boolean
  isActivated: boolean
}

type ReviewFromAPI = {
  _id: string
  name: string
  rating: number
  comment: string
  user: string
}
export type Product = {
  brand: string
  category: string
  countInFavorite: number
  countInStock: number
  countViewed: number
  createdAt: Date
  description: string
  image: string
  isNewProduct: boolean
  name: string
  numReviews: number
  price: number
  qty?: number
  rating: number
  reviews: ReviewFromAPI[]
  updatedAt: Date
  user: string
  _id: string
}
type OrderProductInfo = {
  name: string
  quantity: number
  image: string
  price: number
  product: string
  id: string
}

export type OrderFromAPI = {
  _id: string
  user: string
  isDelivered: boolean
  isPaid: boolean
  itemsPrice: number
  orderItems: OrderProductInfo[]
  paymentMethod: string
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  updatedAt: Date
  createdAt: Date
  paidAt?: Date
}

export type OrderToAPI = {
  orderItems: any[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  itemsPrice: number
  paymentMethod: string
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}

export interface GetAllUsersResponse {
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
  items: UserTypeForList[]
}

export interface GetAllOrdersResponse {
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
  items: OrderFromAPI[]
}

export interface GetAllProductsResponse {
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
  items: Product[]
}

export type SurveyFromDB = {
  user: string
  title: string
  subject: string
  body: string
  recipients: string
  _id: string
  yes: number
  no: number
  dateSent: Date
}
export interface SurveysList {
  totalPages: number
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
  items: SurveyFromDB[]
}

export type ReviewToAPI = {
  rating: number
  comment: string
}
