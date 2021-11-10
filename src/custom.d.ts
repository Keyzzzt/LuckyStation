import { Request } from 'express'

type User = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  isSubscribed: boolean
  createdAt: string
  updatedAt: string
  sessionId: string
  iat: number
  exp: number
}

export interface RequestCustom extends Request {
  user: User
  sessionId: string
}
