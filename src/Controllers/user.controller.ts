/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express'
import { omit } from 'lodash'
import { RequestCustom } from '@src/custom'
import { UserModel } from '@src/models/user.model'
import { cookieOpt } from '@src/Controllers/auth.controller'
import { ApiError } from '@src/exceptions/api.error'
import { tokenService } from '@src/newServices/token.service'

export const getProfile = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-activationLink -password -googleId -createdAt -updatedAt -__v')
    if (!user) throw ApiError.BadRequest('User not found')

    res.status(200).json({
      resultCode: 1,
      message: '',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    next(error.message)
  }
}

export const updateProfile = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    let user = await UserModel.findById(req.user.id)

    if (!user) throw ApiError.BadRequest('User not found')

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    await user.save()
    user = omit(user.toJSON(), 'password', '__v', 'createdAt', 'updatedAt')
    const tokens = tokenService.generateTokens({ id: user._id, email: user.email, isActivated: user.isActivated, isAdmin: user.isAdmin })
    res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

    res.status(200).json({
      accessToken: tokens.accessToken,
      resultCode: 1,
      message: 'You have successfully updated your profile',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    next(error.message)
  }
}
