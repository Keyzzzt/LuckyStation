export interface LoginUser {
  id: string
  email: string
  isActivated: boolean
  isAdmin: boolean
}
export type User = {
  _id: string
  email: string
  logo: string
  isAdmin: boolean
  isSubscribed: boolean
  isActivated: boolean
  credits: number
  favorite: string[]
  createdAt: Date
  updatedAt: Date
}

export type UserTypeForList = {
  id: string
  email: string
  isAdmin: boolean
  isActivated: boolean
}

export interface LoginResponse {
  accessToken: string
  user: LoginUser
}

export type Product = {
  brand: string
  category: string
  colors: string[]
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
  reviews: [] // TODO
  sizes: number[]
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
  is: string
}

export type Order = {
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
  items: Order[]
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
