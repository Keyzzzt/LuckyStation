/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-destructuring */
import { NextFunction, Response } from 'express'
import { RequestCustom, User } from '@src/custom'
import { ApiError } from '@src/exceptions/api.error'
import { tokenService } from '@src/newServices/token.service'

export async function deserializeUser(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) next(ApiError.UnauthorizedError())

    const accessToken = authHeader.split(' ')[1]
    if (!accessToken) next(ApiError.UnauthorizedError())

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) next(ApiError.UnauthorizedError())

    req.user = userData as User

    next()
  } catch (error) {
    return next(ApiError.UnauthorizedError())
  }
}

export function privateRoute(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw ApiError.UnauthorizedError()
    next()
  } catch (error) {
    return next(ApiError.UnauthorizedError())
  }
}

export const adminRoute = (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isAdmin) throw new Error('Admin only')
    next()
  } catch (error) {
    next(ApiError.UnauthorizedError())
  }
}
