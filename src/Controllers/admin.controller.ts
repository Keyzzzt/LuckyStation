/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { validationResult } from 'express-validator'
import { URL } from 'url'
import { Path } from 'path-parser'
import { RequestCustom } from '@src/custom'
import { ProductModel } from '@src/models/product.model'
import { OrderModel } from '@src/models/order.model'
import { SurveyModel } from '@src/models/survey.model'
import { Mailer } from '@src/services/Mailer'
import { surveyTemplate } from '@src/services/emailTemplates/surveyTemplate'
import { ApiError } from '@src/middleware/error.middleware'
import { UserModel } from '@src/models/user.model'
import { TokenModel } from '@src/models/TokenModel'

// @desc     Get all users
// @route    GET /api/admin/user
// @access   Private & Admin
export async function getAllUsers(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      data: req.paginatedResponse,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Delete user by ID
// @route    DELETE /api/user/:id
// @access   Private & Admin
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    await UserModel.deleteOne({ id })
    await TokenModel.deleteOne({ user: id })

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Get user by its ID
// @route    GET /api/user/:id
// @access   Private & Admin
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }
    res.status(200).json({
      data: user,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Change user profile by its ID
// @route    PUT /api/user/:id
// @access   Private & Admin
export async function updateUserProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const user = await UserModel.findById(req.params.id)
    if (!user) {
      return next(ApiError.NotFound('User not found'))
    }

    const { email, isAdmin } = req.body

    user.email = email || user.email
    user.isAdmin = isAdmin

    await user.save()

    return res.status(200).json({
      data: user,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Delete a product by its ID
// @route    DELETE /api/product/:id
// @access   Private & Admin
export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      return next(ApiError.NotFound('Product not found'))
    }

    await product.remove()
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Create new product
// @route    POST /api/product
// @access   Private & Admin
export async function createProduct(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { name, price, image, brand, category, countInStock, description } = req.body
    const product = new ProductModel({
      name,
      price,
      user: req.user.id,
      image,
      brand,
      category,
      countInStock,
      description,
    })

    await product.save()

    return res.status(201).json({
      data: product,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Update a product
// @route    PUT /api/product/:id
// @access   Private & Admin
export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { name, price, image, brand, category, countInStock, description } = req.body
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      return next(ApiError.BadRequest('Product not found'))
    }

    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description

    await product.save()

    return res.status(201).json({
      data: product,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Get all orders
// @route    GET /api/order
// @access   Private & Admin
export async function getAllOrders(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      data: req.paginatedResponse,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Update order to paid
// @route    GET /api/order/:id/pay
// @access   Private & Admin
// TODO Тут нужно будет колдовать
export async function setOrderToPaid(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Validate
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))

    const { id, status, updateTime } = req.body
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isPaid = true
    order.paidAt = Date.now()

    // THis stuff coming from paypal - frontend
    order.paymentResult = {
      id,
      status,
      updateTime,
      emailAddress: 'Set to req.body.payer.email_address',
    }

    await order.save()

    return res.status(201).json({
      data: order,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Set order to - NOT PAID
// @route    PUT /api/order/:id/pay
// @access   Private & Admin
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
    return res.status(201).json({
      data: order,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Set order to delivered
// @route    GET /api/order/:id/delivered
// @access   Private & Admin
export async function setOrderToDelivered(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()

    return res.status(201).json({
      data: order,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Set order to NOT delivered
// @route    PUT /api/order/:id/delivered
// @access   Private & Admin
export async function setOrderToNotDelivered(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isDelivered = false
    order.deliveredAt = undefined
    await order.save()

    return res.status(201).json({
      data: order,
    })
  } catch (error) {
    return next(error.message)
  }
}

export async function createSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { title, subject, body, recipients } = req.body

    const survey = new SurveyModel({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
      user: req.user.id,
      dateSent: Date.now(),
    })

    const mailer = new Mailer(survey, surveyTemplate(survey))
    await mailer.send()
    await survey.save()

    return res.sendStatus(201)
  } catch (error) {
    return next(error.message)
  }
}

export async function getAllSurveys(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(201).json({
      data: req.paginatedResponse,
    })
  } catch (error) {
    return next(error.message)
  }
}

export async function getSurveyById(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const survey = await SurveyModel.findById(req.params.id).select('-recipients')
    if (!survey) {
      return next(ApiError.NotFound('Survey not found'))
    }
    return res.status(201).json({
      data: survey,
    })
  } catch (error) {
    return next(error.message)
  }
}

export async function manageSendgridEvents(req: RequestCustom, res: Response, next: NextFunction) {
  // TODO: Заменить Path на модуль qs и удалить parth-parser
  try {
    const p = new Path('/api/survey/:surveyId/:choice')
    _.chain(req.body)
      .map(({ url, email }) => {
        const match = p.test(new URL(url).pathname)
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice,
          }
        }
      })
      .compact()
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        SurveyModel.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email, responded: false },
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { 'recipients.$.responded': true, 'recipients.$.response': choice },
            lastResponded: new Date(),
          }
        ).exec()
      })
      .value()

    return res.sendStatus(200)
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

export async function allUsersEmailStringForSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
export async function subscribersEmailStringForSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    // TODO:
  } catch (error) {
    return next(error.message)
  }
}
export async function usersThatBoughtProductEmailStringForSurvey(req: RequestCustom, res: Response, next: NextFunction) {
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
