export interface LoginResponse {
  accessToken: string
  _id: string
}

// export interface ErrorResponse {
//   error: string
//   errors: string[]
// }

export type ConfigType = {
  adminColorTheme: string
  customersColorTheme: string
  darkThemeColors: []
  lightThemeColors: []
  defaultLanguage: string
  minPriceForFreeShipping: number
  defaultShippingPriceToNonEUCountries: number
  freeShippingMessage: string
  taxRate: number
}

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
  name: string
}

type ReviewFromAPI = {
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
export type Product = {
  _id: string //
  user: string
  name: string //
  brand: string //
  category: string //
  countInFavorite: number //
  countInStock: number //
  countViewed: number //
  description: string //
  description2: string //
  includes: string //
  maximumLoadCapacity: string
  weight: string //
  size: string  // Todo переделать в массив
  colors: string[] //
  colorsInText: string //
  materials: string //
  careInstructions: string //
  additionalInfo: string
  whatShouldYouKnow: string
  quality: string //
  images: Image[] //
  isNewProduct: boolean //
  numReviews: number //
  price: number //
  qty?: number // TODO WTF
  rating: number //
  isDirty: boolean // TODO WTF
  reviews: ReviewFromAPI[] //
  createdAt: Date //
  updatedAt: Date //
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

export type TermsAndConditions = {
  lang: string
  mainTitle: number
  companyAddress: {
    companyName: string
    companyId: string
    companyAddress: string
    companyPhone: string
    companyEmail: string
  }
  termsAndConditions: [
    {
      paragraphTitle: string
      paragraphText: string
    }
  ]
}
