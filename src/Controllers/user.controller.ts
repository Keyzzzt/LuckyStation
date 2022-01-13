/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { UserModel } from '@src/models/user.model'
import { cookieOpt } from '@src/Controllers/auth.controller'
import { ApiError } from '@src/middleware/error.middleware'
import * as utils from '@src/utils'
import { ProductModel } from '@src/models/product.model'

export async function getProfile(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const user = await await UserModel.findById(req.user.id).select('-password -__v -activationLink -googleId')
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }

    return res.status(200).json(user)
  } catch (error) {
    return next(error.message)
  }
}
export async function subscribe(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }
    const email = req.body.email.trim()

    await utils.handleEmailInStatistics(email, 'allSubscribersEmailList', 'add')
    await utils.handleEmailInStatistics(email, 'allUsersEmailList', 'add')

    const user = await UserModel.findOne({ email })
    if (user) {
      user.isSubscribed = true
      await user.save()
    } else {
      // Модель для не зарегистрированных пользователей
    }

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function unSubscribe(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const email = req.params.email.trim()
    await utils.handleEmailInStatistics(email, 'allSubscribersEmailList', 'remove')
    const user = await UserModel.findOne({ email })
    if (user) {
      user.isSubscribed = false
      await user.save()
    }

    return next()
  } catch (error) {
    return next(error.message)
  }
}

export async function updateProfile(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    // @ts-ignore
    const user = await UserModel.findById(req.user.id)
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }

    const { oldPassword, newPassword, confirmNewPassword } = req.body

    if (!(await user.comparePassword(oldPassword))) {
      return next(ApiError.BadRequest('Wrong password'))
    }

    if (newPassword !== confirmNewPassword) {
      return next(ApiError.BadRequest('Passwords do not match'))
    }
    user.password = req.body.newPassword

    await user.save()
    const tokens = utils.generateTokens({
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

export async function addToFavorite(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.user.id).select('-password')
    const product = await ProductModel.findById(req.params.id)

    if (!user && !product) {
      return next(ApiError.NotFound('User or product not found'))
    }
    const isFavorite = user.favorite.find((item) => item === req.params.id)

    if (isFavorite) {
      return next(ApiError.BadRequest('Product already in favorite list.'))
    }
    user.favorite.push(req.params.id)
    product.countInFavorite += 1
    await user.save()
    await product.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function removeFromFavorite(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.user.id).select('-password')

    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }
    user.favorite = user.favorite.filter((item) => item !== req.params.id)

    user.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function getPayPalClientId(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.send(process.env.PAYPAL_CLIENT_ID)
  } catch (error) {
    return next(error.message)
  }
}
