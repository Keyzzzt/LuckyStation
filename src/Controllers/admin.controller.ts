/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import { URL } from 'url'
import { Path } from 'path-parser'
import { RequestCustom } from '@src/custom'
import { ProductModel } from '@src/models/product.model'
import { OrderModel } from '@src/models/order.model'
import { SurveyModel } from '@src/models/survey.model'
import { Mailer } from '@src/services/Mailer'
import { surveyTemplate } from '@src/services/emailTemplates/surveyTemplate'
import { ApiError } from '@src/exceptions/api.error'
import { UserModel } from '@src/models/user.model'

// @desc     Get all users by Admin
// @route    GET /api/user
// @access   Private & Admin
export const getAllUsersByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserModel.find({})
    if (!users) throw ApiError.BadRequest('User not found')

    res.status(200).json({
      resultCode: 1,
      message: '',
      data: users,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Delete user by Id
// @route    DELETE /api/user/:id
// @access   Private & Admin
export const deleteUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) throw ApiError.BadRequest('User not found')

    await user.remove()

    res.status(200).json({
      resultCode: 1,
      message: 'User successfully removed!',
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Get user by ID
// @route    GET /api/user/:id
// @access   Private & Admin
export const getUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) throw ApiError.BadRequest('User not found')

    res.status(200).json({
      resultCode: 1,
      message: '',
      data: user,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Change user profile by Admin
// @route    PUT /api/user/:id
// @access   Private & Admin
export const updateUserProfileByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) throw ApiError.BadRequest('User not found')

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    await user.save()

    res.status(200).json({
      resultCode: 1,
      message: 'User successfully updated!',
      data: user,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Delete a product
// @route    DELETE /api/product/:id
// @access   Private & Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await ProductModel.findById(req.params.id)
    if (!product) throw ApiError.BadRequest('Product not found')

    await product.remove()
    res.status(200).json({
      resultCode: 1,
      message: 'Product removed!',
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Create a product
// @route    POST /api/product
// @access   Private & Admin
export const createProduct = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
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

    product.save()

    res.status(201).json({
      resultCode: 1,
      message: 'Product created!',
      data: product,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Update a product
// @route    PUT /api/product/:id
// @access   Private & Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, price, image, brand, category, countInStock, description } = req.body
    const product = await ProductModel.findById(req.params.id)
    if (!product) throw ApiError.BadRequest('Product not found')

    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description

    await product.save()

    res.status(201).json({
      resultCode: 1,
      message: 'Product updated!',
      data: product,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Get all orders
// @route    GET /api/order
// @access   Private & Admin
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderModel.find({})
    if (!orders || orders.length === 0) throw ApiError.BadRequest('Orders not found')
    res.status(200).json({
      resultCode: 1,
      message: '',
      data: orders,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Update order to paid
// @route    GET /api/order/:id/pay
// @access   Private & Admin
// TODO Тут нужно будет колдовать
export const setOrderToPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, status, updateTime } = req.body
    const order = await OrderModel.findById(req.params.id)
    if (!order) throw ApiError.BadRequest('Order not found')

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

    res.status(201).json({
      resultCode: 1,
      message: '',
      data: order,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Set order to - NOT PAID
// @route    PUT /api/order/:id/pay
// @access   Private & Admin
export const setOrderToNotPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) throw ApiError.BadRequest('Order not found')

    order.isPaid = false
    order.paidAt = undefined
    order.paymentResult = {
      id: '',
      status: '',
      updateTime: '',
      emailAddress: '',
    }

    await order.save()
    res.status(201).json({
      resultCode: 1,
      message: '',
      data: order,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Set order to delivered
// @route    GET /api/order/:id/delivered
// @access   Private & Admin
export const setOrderToDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) throw ApiError.BadRequest('Order not found')

    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()

    res.status(201).json({
      resultCode: 1,
      message: '',
      data: order,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Set order to NOT delivered
// @route    PUT /api/order/:id/delivered
// @access   Private & Admin
export const setOrderToNotDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) throw ApiError.BadRequest('Order not found')

    order.isDelivered = false
    order.deliveredAt = undefined
    await order.save()

    res.status(201).json({
      resultCode: 1,
      message: '',
      data: order,
    })
  } catch (error) {
    next(error.message)
  }
}

export async function createSurvey(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const { title, subject, body, recipients } = req.body

    const survey = new SurveyModel({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
      user: req.user.id,
      dateSent: Date.now(),
    })

    // Great place to send an email!
    const mailer = new Mailer(survey, surveyTemplate(survey))
    await mailer.send()
    await survey.save()

    res.status(201).json({
      resultCode: 1,
      message: '',
      // data: survey,
    })
  } catch (error) {
    next(error.message)
  }
}

export async function getAllSurveys(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const surveys = await SurveyModel.find({}).select('-recipients')
    if (!surveys) throw ApiError.BadRequest('Surveys not found')
    res.status(201).json({
      resultCode: 1,
      message: '',
      data: surveys,
    })
  } catch (error) {
    next(error.message)
  }
}

// TODO: getSurveyById

export async function manageSendgridEvents(req, res) {
  // TODO: Заменить Path на модуль qs и удалить parth-parser
  // TODO: response
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

  res.send('OK')
}
