/* eslint-disable no-underscore-dangle */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-destructuring */
import { NextFunction, Response, Request } from 'express'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { verifyJWT } from './issueTokenPair'
import { reIssueAccessToken } from '@src/services/session.services'
import { accessTokenOptions, refreshTokenOptions } from '@src/Controllers/session.controller'

export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  // Получаем accessToken & refreshToken из cookies, выходим если нет accessToken

  const { accessToken, refreshToken } = req.cookies
  console.log(verifyJWT(accessToken).payload)

  if (!accessToken) {
    return next()
  }

  // При протухшем токене verifyJWT(accessToken) вернет { payload: null, expired: true, valid: false }
  const { payload, expired } = verifyJWT(accessToken)

  // Если accessToken не протух, то помещаем в req.user инфу о пользователе из accessToken и выходим.
  if (payload) {
    // To avoid ts-inore - use lodash set function
    // @ts-ignore
    req.user = payload
    return next()
  }

  // Если accessToken протух и есть refreshToken, выдаем новую пару accessToken & refreshToken
  if (expired && refreshToken) {
    const tokens = await reIssueAccessToken(refreshToken)

    if (tokens) {
      res.cookie('accessToken', tokens.accessToken, accessTokenOptions)
      res.cookie('refreshToken', refreshToken, refreshTokenOptions)

      // @ts-ignore
      req.user = verifyJWT(tokens.accessToken).payload

      return next()
    }
  }
  return next()
}

export function privateRoute(req: Request, res: Response, next: NextFunction) {
  try {
    //@ts-ignore
    if (!req.user) {
      throw new Error('Not authorized')
    }
    return next()
  } catch (error) {
    return res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'privateRoute middleware'],
      data: null,
    })
  }
}

export const adminRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //@ts-ignore
    if (req.user && req.user.isAdmin) {
      next()
    } else {
      throw new Error('Not authorized, admin access only')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'adminRoute controller'],
      data: null,
    })
  }
}
