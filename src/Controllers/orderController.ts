/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import asyncHandler from 'express-async-handler'
import { Order } from '@src/Models/OrderModel'

// @desc     Create new order
// @route    POST /api/order
// @access   Private
const createNewOrder = asyncHandler(async (req: any, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['No items in order'],
      data: null,
    })
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })
    const createdOrder = await order.save(order)
    res.status(201).json({
      resultCode: 1,
      errorMessage: [],
      data: createdOrder,
    })
  }
})

// @desc     Get an order by ID
// @route    GET /api/order/:id
// @access   Private
const getOrderById = asyncHandler(async (req: any, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')
  if (order) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: order,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Order not found'],
      data: null,
    })
  }
})

// @desc     Get own orders
// @route    GET /api/order/myorders
// @access   Private
const getOwnOrders = asyncHandler(async (req: any, res) => {
  const orders = await Order.find({ user: req.user._id })
  // Если ищем много документов, то нужно проверять на length
  // Поскольку если не найдем то получим пустой массив что есть thruthy
  if (orders && orders.length > 0) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: orders,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Orders not found'],
      data: null,
    })
  }
})

export { createNewOrder, getOrderById, getOwnOrders }
