/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express'
import { ID } from '@src/Types'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { findOrder, createOrder } from '@src/services/order.services'
import { request } from 'https'

// TODO Define OrderType

type CreateOrderBody = {
  orderItems: any[]
  shippingAddress: string
  paymentMethod: string
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
}

// @desc     Create new order
// @route    POST /api/order
// @access   Private
const createNewOrder = async (req: Request<object, object, CreateOrderBody, object>, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
    if (orderItems && orderItems.length === 0) {
      throw new Error('No products in order')
    } else {
      const order = await createOrder({
        // @ts-ignore
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
          errorMessage: [],
          data: createdOrder,
        })
      } else {
        throw new Error('Server error')
      }
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'createNewOrder controller'],
      data: null,
    })
  }
}

// @desc     Get an order by ID
// @route    GET /api/order/:id
// @access   Private
const getOrderById = async (req: Request<ID>, res: Response) => {
  try {
    const order = await findOrder(req.params.id, 'id')
    if (!order) throw new Error('Order not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: order,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getOrderById controller'],
      data: null,
    })
  }
}

// @desc     Get own orders
// @route    GET /api/order/myorders
// @access   Private
const getOwnOrders = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const orders = await findOrder({ user: req.user._id }, 'all')
    if (!orders || orders.length === 0) throw new Error('Orders not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: orders,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getOwnOrders controller'],
      data: null,
    })
  }
}

export { createNewOrder, getOrderById, getOwnOrders }
