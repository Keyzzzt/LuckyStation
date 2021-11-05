/* eslint-disable prefer-destructuring */
import { NextFunction, Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { findUser } from '@src/services/user.services'

export const privateRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
      const decoded: any = jwt.verify(token, process.env.JWT_TOKEN)
      res.locals.user = await findUser({ _id: decoded.id }, 'id')
      next()
    } else {
      throw new Error('Not authorized')
    }
    if (!token) throw Error('Not authorized')
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
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
