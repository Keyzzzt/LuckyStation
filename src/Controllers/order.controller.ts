/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import ApiError from '@src/middleware/error.middleware'
import { OrderModel } from '@src/models/order.model'

export async function createNewOrder(req: RequestCustom, res: Response, next: NextFunction) {
  // FIXME: Если пользователь купил незарегистрированный то нужно в user записать из поля name, которое ждем с фронта
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
      return next(ApiError.BadRequest('No products in order!'))
    }

    const order = await OrderModel.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    return res.status(201).json(order._id)
  } catch (error) {
    return next(error.message)
  }
}

// Frontend DONE
export async function getOrderById(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await OrderModel.findById(req.params.id).select('-__v')
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    return res.status(200).json(order)
  } catch (error) {
    return next(error.message)
  }
}

export async function getOwnOrders(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

export async function setOrderToPaid(req: Request, res: Response, next: NextFunction) {
  try {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))

    const { id, status, update_time } = req.body
    const order = await OrderModel.findById(req.params.orderId)
    if (!order) {
      return next(ApiError.NotFound('Order not found'))
    }

    order.isPaid = true
    order.paidAt = Date.now()

    order.paymentResult = {
      id,
      status,
      updateTime: update_time,
      emailAddress: req.body.payer.email_address,
    }

    const updated = await order.save()

    return res.status(201).json(updated)
  } catch (error) {
    return next(error.message)
  }
}
