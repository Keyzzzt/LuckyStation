/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { ApiError } from '@src/middleware/error.middleware'
import { OrderModel } from '@src/models/order.model'

export const createNewOrder = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body
    if (orderItems && orderItems.length === 0) {
      throw ApiError.BadRequest('Order not found')
    }

    const order = await OrderModel.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    return res.status(201).json({
      data: order,
    })
  } catch (error) {
    return next(error.message)
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) {
      throw ApiError.BadRequest('Order not found')
    }

    return res.status(200).json({
      data: order,
    })
  } catch (error) {
    return next(error.message)
  }
}

export const getOwnOrders = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderModel.find({ user: req.user.id })
    if (!orders || orders.length === 0) {
      throw ApiError.BadRequest('Orders not found')
    }

    return res.status(200).json({
      data: orders,
    })
  } catch (error) {
    return next(error.message)
  }
}
