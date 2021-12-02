import jwt from 'jsonwebtoken'
import { TokenModel } from '@src/models/TokenModel'
import { ApiError } from '@src/middleware/error.middleware'

export type PayloadType = {
  id: string
  email: string
  isActivated: boolean
  isAdmin: boolean
}

export const tokenService = {
  generateTokens: (payload: PayloadType) => {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.access_token_life })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.refresh_token_life })
    return { accessToken, refreshToken }
  },
  saveToken: async (userId, refreshToken) => {
    const tokenData = await TokenModel.findOne({ user: userId })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({ user: userId, refreshToken })
    return token
  },
  removeToken: async (refreshToken: string) => {
    const token = await TokenModel.deleteOne({ refreshToken })
    return token
  },
  findToken: async (refreshToken: string) => {
    const token = await TokenModel.findOne({ refreshToken })
    if (!token) throw ApiError.BadRequest('Session not found')
    return token
  },
  validateAccessToken: (token: string): PayloadType | null => {
    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as PayloadType
      return user
    } catch (error) {
      return null
    }
  },
  validateRefreshToken: (token: string): PayloadType | null => {
    try {
      const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as PayloadType
      return user
    } catch (error) {
      return null
    }
  },
}
