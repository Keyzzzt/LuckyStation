import { IUser } from './01_Base'

export interface AuthResponse {
  data: IUser
  resultCode: number
  message: string
  accessToken: string
}

export interface registerResponse {
  resultCode: number
  message: string
}

export interface logoutResponse {
  resultCode: number
  message: string
}
