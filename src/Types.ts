/* eslint-disable camelcase */
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
export interface GoogleUserProfile {
  id: string
  email: string
  name: string
  verified_email: boolean
  given_name: string
  family_name: string
  picture: string
  locale: string
  iat: Date
  exp: Date
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

export type SurveyType = {
  id: string
  title: string
  body: string
  subject: string
}
