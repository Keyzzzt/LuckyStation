type ReviewType = {
  name: string
  rating: number
  comment: string
  user: string
}
export type UserType = {
  _id: string
  name: string
  email: string
  password: string
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
  refreshToken: string
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
  reviews: ReviewType[]
  numReviews: number
}
// export type CommonErrorType = {
//   errorMessage: string[]
//   resultCode: 0
//   data: null
// }

export type ID = {
  id: string
}
