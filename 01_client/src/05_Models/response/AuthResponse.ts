import { IUser } from '../IUser'

export interface AuthResponse {
  resultCode: number
  message: string
  accessToken: string
  data: {
    user: IUser
  }
}

export interface registerResponse {
  resultCode: number
  message: string
}

export interface logoutResponse {
  resultCode: number
  message: string
}
