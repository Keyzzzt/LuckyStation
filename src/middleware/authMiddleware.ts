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
      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      res.status(401).json({
        resultCode: 0,
        errorMessage: ['Not authorized, token failed'],
        data: null,
      })
    }
  }
  if (!token) {
    res.status(401).json({
      resultCode: 0,
      errorMessage: ['Not authorized.'],
      data: null,
    })
  }
})

export const adminRoute = asyncHandler(async (req: any, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401).json({
      resultCode: 0,
      errorMessage: ['Not authorized, admin access only.'],
      data: null,
    })
  }
})
