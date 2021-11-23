/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { Request, Response, NextFunction } from 'express'
import { RequestCustom } from '@src/custom'
import { ApiError } from '@src/exceptions/api.error'
import { OrderModel } from '@src/models/order.model'

export const createNewOrder = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) throw ApiError.BadRequest('Order not found')

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
    res.status(201).json({
      resultCode: 1,
      message: '',
      data: order,
    })
  } catch (error) {
    next(error.message)
  }
}

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) throw ApiError.BadRequest('Order not found')

    res.status(200).json({
      resultCode: 1,
      message: '',
      data: order,
    })
  } catch (error) {
    next(error.message)
  }
}

export const getOwnOrders = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const orders = await OrderModel.find({ user: req.user.id })
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
