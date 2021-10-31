/* eslint-disable prefer-destructuring */
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { User } from '@src/Models/UserModel'

// TODO Remove :any

export const privateRoute = asyncHandler(async (req: any, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded: any = jwt.verify(token, process.env.JWT_TOKEN)
      req.user = await User.findById(decoded.id).select('-password -refreshToken')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed.')
    }
  }
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token.')
  }
})
