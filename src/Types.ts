export type UserType = {
  name: string
  email: string
  password: string
  isAdmin?: boolean
}
export type ProductType = {
  user: UserType | null
  name: string
  image: string
  description: string
  brand: string
  category: string
  rating: number
  price: number
  countInStock: number
  numReviews: number
}
export type CommonErrorType = {
  errorMessage: string[]
  resultCode: 0
  data: null
}
