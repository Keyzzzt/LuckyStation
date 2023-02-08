import { ContactInfo } from '../03_Reducers/cart/cartReducer'
import { GalleryListItemType } from '../03_Reducers/galleryReducer'

// Request
export type OrderCreateRequestType = {
  orderItems: {name: string, quantity: number | undefined, images: any, price: number, product: string}[]
  shippingAddress: ContactInfo
  itemsPrice: number
  paymentMethod: string
  shippingPrice: number
  taxPrice: number
  totalPrice: number
}
export type UpdateProfileRequestType = {
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}
export type ReviewRequestType = {
  rating: number
  comment: string
}
// TODO UpdateProductRequestType

// Response
export type LoginResponseType = {
  accessToken: string
  _id: string
}
export type ConfigResponseType = {
  _id: boolean
  companyName: string
  adminColorTheme: string
  customersColorTheme: string
  darkThemeColors: []
  lightThemeColors: []
  defaultLanguage: string
  minPriceForFreeShipping: number
  defaultShippingPriceToNonEUCountries: number
  freeShippingMessage: string
  taxRate: number
  aboutSectionParagraphs: string[]
}
export type UserResponseType = {
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
  accessToken?: string // TODO Check
}
export type UserDataForListType = {
  _id: string
  email: string
  name: string
  phone: string
  isAdmin: boolean
  isActivated: boolean
  activationToken: string
  passwordResetToken: string
}
export type UsersListResponseType = {
  next?: {
    page: number
    limit: number
  }
  prev?: {
    page: number
    limit: number
  }
  totalPages: number
  items: UserDataForListType[]
}

export type GalleryListResponseType = {
  items: GalleryListItemType[]
}
export type ProductResponseType = {
  _id: string
  user: string
  name: string
  brand: string
  category: string
  countInFavorite: number
  countInStock: number
  countViewed: number
  description: string
  description2: string
  includes: string
  maximumLoadCapacity: string
  weight: string
  size: string  // Todo переделать в массив
  colors: string[]
  colorsInText: string
  materials: string
  careInstructions: string
  additionalInfo: string
  whatShouldYouKnow: string
  quality: string
  images: Image[]
  isNewProduct: boolean
  numReviews: number
  price: number
  qty?: number // TODO WTF
  rating: number
  isDirty: boolean // TODO WTF
  isPromo: boolean
  isShowOnMainPage: boolean
  reviews: ReviewResponseType[]
  createdAt: string
  updatedAt: string
}
export type OrderResponseType = {
  _id: string
  user: string
  paymentMethod: string
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isDelivered: boolean
  isPaid: boolean
  isDirty: boolean
  orderItems: OrderItemsType[]
  paymentResult: PaymentResultType
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
    name: string
    lastName: string
    phone: string
    apartment: string
  }
  updatedAt: string
  createdAt: string
  paidAt?: string
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
  totalPages: number
  items: OrderResponseType[]
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
  totalPages: number
  items: ProductResponseType[]
}
export type TermsAndConditionsResponseType = {
  companyAddress: {
    companyName: string
    companyId: string
    companyAddress: string
    companyPhone: string
    companyEmail: string
  }
  _id: string
  user: string
  lang: string
  mainTitle: string
  termsAndConditions: [
    {
      _id: string
      paragraphTitle: string
      paragraphText: string
    }
  ]
  createdAt: string
  updatedAt: string
}


// Chunks
type OrderItemsType = {
  _id: string
  name: string
  quantity: number
  images: Image[]
  price: number
  product: string
}
type ReviewResponseType = {
  _id: string
  name: string
  rating: number
  comment: string
  user: string
}
export type Image = {
  imageSrc: string
  imageAlt: string
  _id: string
}
type PaymentResultType = {
  id: string
  status: string
  updateTime: string
  emailAddress: string
}

export interface ErrorResponseType {
  error: string
  errors: string[]
}