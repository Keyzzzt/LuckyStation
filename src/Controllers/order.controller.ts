/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express'
import { RequestCustom } from '@src/custom'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { findOrder, createOrder } from '@src/services/order.services'

const createNewOrder = async (req: RequestCustom, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) throw new Error('No products in order') // TODO узнать, прервет ли выполнение функции throw new Error

    const order = await createOrder({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder = await order.save()
    if (createdOrder) {
      res.status(201).json({
        resultCode: 1,
        message: [],
        data: createdOrder,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'createNewOrder controller'],
      data: null,
    })
  }
}

const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await findOrder(req.params.id, 'id')
    if (!order) throw new Error('Order not found')

    res.status(200).json({
      resultCode: 1,
      message: [],
      data: order,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'getOrderById controller'],
      data: null,
    })
  }
}

const getOwnOrders = async (req: RequestCustom, res: Response) => {
  try {
    const orders = await findOrder({ user: req.user._id }, 'all')
    if (!orders || orders.length === 0) throw new Error('Orders not found')

    res.status(200).json({
      resultCode: 1,
      message: [],
      data: orders,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'getOwnOrders controller'],
      data: null,
    })
  }
}

export { createNewOrder, getOrderById, getOwnOrders }
