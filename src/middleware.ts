/* eslint-disable no-redeclare */
import { NextFunction, Response } from 'express'
import { RequestCustom } from '@src/custom'
import { ApiError } from '@src/middleware/error.middleware'
import * as utils from '@src/utils'

export async function deserializeUser(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return next()
    }

    const accessToken = authHeader.split(' ')[1]
    if (!accessToken) {
      return next()
    }

    const userData = utils.validateAccessToken(accessToken)
    if (!userData) {
      return next()
    }

    req.user = userData

    return next()
  } catch (error) {
    return next(error.message)
  }
}

export function privateRoute(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(ApiError.UnauthorizedError())
    }
    return next()
  } catch (error) {
    return next(error.message)
  }
}

export const adminRoute = (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isAdmin) {
      return next(ApiError.UnauthorizedError())
    }
    return next()
  } catch (error) {
    return next(error.message)
  }
}

export const paginatedResult = (model, flag) => {
  return async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.params.page)
      const limit = Number(req.params.limit)
      const keyword = req.query.keyword
        ? {
            name: {
              $regex: req.query.keyword,
              $options: 'i',
            },
          }
        : {}
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
      const totalDocs = await model.countDocuments().exec()
      const totalPages = Math.ceil(totalDocs / limit)
      const response = {} as any

      response.totalPages = totalPages

      if (endIndex < totalDocs) {
        response.next = {
          page: page + 1,
          limit,
        }
      }
      if (startIndex > 0) {
        response.prev = {
          page: page - 1,
          limit,
        }
      }
      if (flag === 'own') {
        response.items = await model.find({ user: req.user.id }).select('-password -__v -activationLink').limit(limit).skip(startIndex).exec()
        if (!response.items || response.items.length === 0) {
          return next(ApiError.NotFound('Not found'))
        }

        req.paginatedResponse = response
        return next()
      }

      response.items = await model
        .find({ ...keyword })
        .select('-password -__v -recipients -activationLink -googleId -logo -isSubscribed -credits -favorite -createdAt -updatedAt')
        .limit(limit)
        .skip(startIndex)
        .exec()
      if (!response.items || response.items.length === 0) {
        return next(ApiError.NotFound('Not found'))
      }

      req.paginatedResponse = response
      return next()
    } catch (error) {
      return next(error.message)
    }
  }
}
