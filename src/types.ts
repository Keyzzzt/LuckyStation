/* eslint-disable camelcase */
export type PayloadType = {
  _id: string
  email: string
  isActivated: boolean
  isAdmin: boolean
}

export type CreateUserInput = {
  name: string
  email: string
  password: string
}

export interface GoogleTokens {
  access_token: string
  expiresIn: number
  refresh_token: string
  scope: string
  id_token: string
}
export interface GetAllUsers {
  items: []
  next: {
    page: number
    limit: number
  }
  prev: {
    page: number
    limit: number
  }
}
