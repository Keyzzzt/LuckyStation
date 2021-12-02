/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { UserModel } from '@src/models/user.model'
import { cookieOpt } from '@src/Controllers/auth.controller'
import { ApiError } from '@src/middleware/error.middleware'
import { tokenService } from '@src/newServices/token.service'

export const getProfile = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password')
    if (!user) {
      throw ApiError.BadRequest('User not found')
    }

    return res.status(200).json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          isActivated: user.isActivated,
          isAdmin: user.isAdmin,
        },
      },
    })
  } catch (error) {
    return next(error.message)
  }
}

export const updateProfile = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))

    // @ts-ignore
    const user = await UserModel.findById(req.user.id)
    if (!user) throw ApiError.BadRequest('User not found')

    const { oldPassword, newPassword, confirmNewPassword } = req.body

    if (!(await user.comparePassword(oldPassword))) {
      throw ApiError.BadRequest('Wrong password')
    }

    if (newPassword && newPassword !== confirmNewPassword) {
      throw ApiError.BadRequest('Passwords do not match')
    }
    user.password = req.body.password

    await user.save()
    const tokens = tokenService.generateTokens({
      id: user._id,
      email: user.email,
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
    })
    res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

    return res.status(200).json({
      accessToken: tokens.accessToken,
      data: {
        user: {
          id: user._id,
          email: user.email,
          isActivated: user.isActivated,
          isAdmin: user.isAdmin,
        },
      },
    })
  } catch (error) {
    return next(error.message)
  }
}
