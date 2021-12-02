import { NextFunction, Response } from 'express'
import { RequestCustom } from '@src/custom'
import { ApiError } from '@src/middleware/error.middleware'
import { tokenService } from '@src/newServices/token.service'

export async function deserializeUser(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) next(ApiError.UnauthorizedError())

    const accessToken = authHeader.split(' ')[1]
    if (!accessToken) next(ApiError.UnauthorizedError())

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) next(ApiError.UnauthorizedError())

    req.user = userData

    return next()
  } catch (error) {
    return next(error.message)
  }
}

export function privateRoute(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.UnauthorizedError()
    return next()
  } catch (error) {
    return next(error.message)
  }
}

export const adminRoute = (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isAdmin) throw new Error('Admin only')
    return next()
  } catch (error) {
    return next(error.message)
  }
}
