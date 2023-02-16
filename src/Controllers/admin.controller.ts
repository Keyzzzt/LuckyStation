/* eslint-disable array-callback-return,prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { ProductModel } from '@src/models/product.model'
import { OrderModel } from '@src/models/order.model'
import ApiError from '@src/middleware/error.middleware'
import { UserModel } from '@src/models/user.model'
import { TokenModel } from '@src/models/TokenModel'
import * as utils from '@src/utils'
import { StatisticModel } from '@src/models/statistic.model'
import { getUserProfile } from '@src/mongoRequests'
import { TermsAndConditionsModel } from '@src/models/TermsAndConditions.model'

export async function getAllUsers(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

export async function getStatistic(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const statistic = await StatisticModel.findOne({ name: 'Statistic' }).select(
      '-__v -_id -name -createdAt -updatedAt',
    )
    return res.status(200).json(statistic)
  } catch (error) {
    return next(error.message)
  }
}

export async function removeEmailFromList(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }
    const { email } = req.body
    await UserModel.findOneAndUpdate({ email }, { isSubscribed: false })

    await utils.handleEmailInStatistics(email, 'allUsersEmailList', 'remove')
    await utils.handleEmailInStatistics(email, 'allSubscribersEmailList', 'remove')
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const user = await UserModel.findById(id)
    if(user.isAdmin) {
      const users = await UserModel.find({})
      const admins = users.filter(u => u.isAdmin)
      if (admins.length === 1) {
        return next(ApiError.BadRequest(`${admins[0].name} is the only one admin now. Please grant admin access to another person before make any changes.`))
      }
    }
    await UserModel.findOneAndDelete({ _id: id })
    await TokenModel.deleteOne({ user: id })
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    // No point to check if there is a id, as mongo will return 500 error if no id
    const user = await UserModel.findById(req.params.id).select(
      '-password -__v -activationToken -googleId -passwordResetToken',
    )
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }
    res.status(200).json(user)
  } catch (error) {
    next(error.message)
  }
}

export async function setUsersAdminStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }
    const { id } = req.params
    const newStatus = req.body.isAdmin
    if (!newStatus) {
      const users = await UserModel.find({})
      const admins = users.filter(u => u.isAdmin)
      if (admins.length === 1) {
        return next(ApiError.BadRequest(`${admins[0].name} is the only one admin now. Please grant admin access to another person before make any changes.`))
      }
    }
    await UserModel.findByIdAndUpdate(id, { isAdmin: newStatus })
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await ProductModel.findOneAndDelete({ _id: req.params.id })
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function createProduct(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    // }

    const {
      name,
      price,
      images,
      brand,
      category,
      countInStock,
      description,
      description2,
      includes,
      maximumLoadCapacity,
      weight,
      size,
      colors,
      colorsInText,
      materials,
      careInstructions,
      additionalInfo,
      whatShouldYouKnow,
      quality,
      isNewProduct,
      isPromo,
      isShowOnMainPage,
    } = req.body
    const product = new ProductModel({
      name,
      price,
      user: req.user._id,
      images,
      brand,
      category,
      countInStock,
      description,
      description2,
      includes,
      maximumLoadCapacity,
      weight,
      size,
      colors,
      colorsInText,
      materials,
      careInstructions,
      additionalInfo,
      whatShouldYouKnow,
      quality,
      isNewProduct,
      isPromo,
      isShowOnMainPage,
    })

    await product.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { name, price, images, brand, category, countInStock, description, isNewProduct } = req.body
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      return next(ApiError.BadRequest('Product not found'))
    }

    product.name = name
    product.price = price
    product.images = images
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description
    product.isNewProduct = isNewProduct

    await product.save()

    return res.status(200).json(product)
  } catch (error) {
    return next(error.message)
  }
}

export async function getAllOrders(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

export async function setOrderToPaid(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('hello')

    const order = await OrderModel.findById(req.params.id)
    console.log(order)

    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: '',
      status: '',
      updateTime: '',
      emailAddress: '',
    }

    await order.save()
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function setOrderToNotPaid(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isPaid = false
    order.paidAt = undefined
    order.paymentResult = {
      id: '',
      status: '',
      updateTime: '',
      emailAddress: '',
    }

    await order.save()
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function setOrderToDelivered(req: Request, res: Response, next: NextFunction) {
  try {
    console.log('hello')

    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function setOrderToNotDelivered(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isDelivered = false
    order.deliveredAt = undefined
    await order.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function termsAndConditions(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    // }
    const newTerms = req.body

    const updatedTerms = await TermsAndConditionsModel.findOneAndUpdate({ lang: newTerms.lang }, { ...newTerms })
    if (!updatedTerms) {
      const terms = new TermsAndConditionsModel({ user: req.user._id, ...newTerms })
      await terms.save()
      return res.status(201).json(terms)
    }

    return res.status(200).json(newTerms)
  } catch (error) {
    return next(error.message)
  }
}

export async function getAllSubscribers(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}

export async function getReviewsList(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
