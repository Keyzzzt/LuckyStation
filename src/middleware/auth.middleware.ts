/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-destructuring */
import { NextFunction, Response } from 'express'
import { RequestCustom } from '@src/custom'
import { verifyJWT } from './issueTokenPair'
import { reIssueAccessToken } from '@src/services/session.services'
import { accessTokenOptions, refreshTokenOptions } from '@src/Controllers/session.controller'
import { SessionModel } from '@src/models/session.model'
import { issueStatusCode } from '@src/middleware/issueStatusCode'

export async function deserializeUser(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // Получаем accessToken & refreshToken из cookies, выходим если нет accessToken
    const { accessToken, refreshToken } = req.cookies
    if (!accessToken) {
      console.log('No access token')

      return next()
    }

    // Получаем данные из accessToken. Если accessToken не протух, то помещаем в req.user инфу о пользователе из accessToken и выходим
    const { payload, expired } = verifyJWT(accessToken)
    console.log('payload ', payload)

    if (payload && !expired) {
      req.user = payload
      req.sessionId = payload.sessionId
      return next()
    }

    // Если accessToken протух и есть refreshToken, выдаем новую пару accessToken & refreshToken
    if (expired && refreshToken) {
      const tokens = await reIssueAccessToken(refreshToken)
      if (tokens) {
        res.cookie('accessToken', tokens.accessToken, accessTokenOptions)
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)
        req.user = verifyJWT(tokens.accessToken).payload

        return next()
      }
    }
    return next()
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message],
      data: null,
    })
  }
}

export async function privateRoute(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw new Error('You are not authorized to access this application.')
    const session = await SessionModel.findOne({ user: req.user._id })
    if (!session) throw new Error('Not authorized')
    next()
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message],
      data: null,
    })
  }
}

export const adminRoute = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isAdmin) throw new Error('Admin only')
    next()
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message],
      data: null,
    })
  }
}
