/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-destructuring */
import { NextFunction, Response, Request } from 'express'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { signJWT, verifyJWT } from './issueTokenPair'
import { getSession } from '@src/fakeDB'

// export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let token
//     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1]
//       const decoded: any = jwt.verify(token, process.env.JWT_TOKEN)
//       res.locals.user = await findUser({ _id: decoded.id }, 'id')
//       next()
//     } else {
//       throw new Error('Not authorized')
//     }
//     if (!token) throw Error('Not authorized')
//   } catch (error) {
//     res.status(issueStatusCode(error.message)).json({
//       resultCode: 0,
//       errorMessage: [error.message, 'privateRoute controller'],
//       data: null,
//     })
//   }
// }

// This function

export async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies

  if (!accessToken) {
    return next()
  }
  const { payload, expired } = verifyJWT(accessToken)

  // For valid accesToken
  if (payload) {
    // To avoid ts-inore - use lodash set function
    // @ts-ignore
    req.user = payload
    return next()
  }
  // For expired but valid accessToken
  const { payload: refresh } = expired && refreshToken ? verifyJWT(refreshToken) : { payload: null }
  if (!refresh) return next()
  // TODO Fake DB
  const session = getSession(refresh.sessionId)
  if (!session) return next()
  const newAccessToken = signJWT(session, '15m')
  res.cookie('accessToken', newAccessToken, {
    maxAge: 30000, // minutes
    httpOnly: true,
  })
  //@ts-ignore
  req.user = verifyJWT(newAccessToken).payload

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
      errorMessage: [error.message, 'privateRoute controller'],
      data: null,
    })
  }
}

export const adminRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.user && res.locals.user.isAdmin) {
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
