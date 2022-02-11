/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { UserModel } from '@src/models/user.model'
import { cookieOpt } from '@src/Controllers/auth.controller'
import ApiError from '@src/middleware/error.middleware'
import * as utils from '@src/utils'
import { ProductModel } from '@src/models/product.model'
import { getUserProfile } from '@src/mongoRequests'

export async function getProfile(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const profile = await getUserProfile(req.user._id)
    if (!profile) {
      return next(ApiError.NotFound('User not found'))
    }
    return res.status(200).json(profile)
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

    await UserModel.findOneAndUpdate({ email }, { isSubscribed: true })

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function unSubscribe(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const email = req.params.email.trim()
    await utils.handleEmailInStatistics(email, 'allSubscribersEmailList', 'remove')
    await UserModel.findOneAndUpdate({ email }, { isSubscribed: false })
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

    const user = await UserModel.findById(req.user._id)
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
      _id: user._id,
      email: user.email,
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
    })
    res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

    const profile = await getUserProfile(req.user._id)
    return res.status(200).json({
      accessToken: tokens.accessToken,
      ...profile,
    })
  } catch (error) {
    return next(error.message)
  }
}

export async function addToFavorite(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.user._id).select('-password')
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }
    const isFavorite = user.favorite.find(item => item === req.params.id)

    if (isFavorite) {
      return next(ApiError.BadRequest('Product already in favorite list.'))
    }
    // Нужна проверка на продукт, поскольку конструкция ниже не вернет ошибку даже если продукта с таким id нет
    // Если продукт был, он вернется, если нет - null
    const product = await ProductModel.findByIdAndUpdate(req.params.id, { $inc: { countInFavorite: 1 } })
    if (!product) {
      return next(ApiError.NotFound('Product not found'))
    }
    user.favorite.push(req.params.id)
    await user.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function removeFromFavorite(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.user._id).select('-password')
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }
    const isFavorite = user.favorite.find(item => item === req.params.id)

    if (!isFavorite) {
      return next(ApiError.BadRequest('Product not in favorite list.'))
    }
    const product = await ProductModel.findByIdAndUpdate(req.params.id, { $inc: { countInFavorite: -1 } })
    if (!product) {
      return next(ApiError.NotFound('Product not found'))
    }
    user.favorite = user.favorite.filter(item => item !== req.params.id)
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
