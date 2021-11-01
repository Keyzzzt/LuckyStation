/* eslint-disable no-underscore-dangle */
import asyncHandler from 'express-async-handler'
import { User } from '@src/Models/UserModel'
import { Product } from '@src/Models/ProductModel'
import { Order } from '@src/Models/OrderModel'

// @desc     Get all users
// @route    GET /api/user
// @access   Private & Admin
export const getAllUsers = asyncHandler(async (req: any, res) => {
  const users = await User.find({})
  if (users && users.length > 0) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: users,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Users not found'],
      data: null,
    })
  }
})

// @desc     Delete user by Id
// @route    DELETE /api/user/:id
// @access   Private & Admin
export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: null,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: null,
    })
  }
})

// @desc     Get user by ID
// @route    GET /api/user/:id
// @access   Private & Admin
export const getUserById = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken')
  if (user) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: user,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: null,
    })
  }
})

// @desc     Change user profile by Admin
// @route    PUT /api/user/:id
// @access   Private & Admin
export const updateUserProfileByAdmin = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    if (updatedUser) {
      res.status(200).json({
        resultCode: 1,
        errorMessage: [],
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
      })
    }
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: null,
    })
  }
})

// @desc     Delete a product
// @route    DELETE /api/product/:id
// @access   Private & Admin
export const deleteProduct = asyncHandler(async (req: any, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: null,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Product not found'],
      data: null,
    })
  }
})

// @desc     Create a product
// @route    POST /api/product
// @access   Private & Admin
export const createProduct = asyncHandler(async (req: any, res) => {
  const product = new Product({
    name: 'Sample product',
    price: 100,
    user: req.user._id,
    image: 'image link here',
    brand: 'Cherry',
    category: 'sky',
    countInStock: 100,
    numReviews: 0,
    description: 'Sample product description here',
  })

  const createdProduct = await product.save()

  if (createdProduct) {
    res.status(201).json({
      resultCode: 1,
      errorMessage: [],
      data: createdProduct,
    })
  } else {
    res.status(500).json({
      resultCode: 0,
      errorMessage: ['Product has not been created'],
      data: null,
    })
  }
})

// @desc     Update a product
// @route    PUT /api/product/:id
// @access   Private & Admin
export const updateProduct = asyncHandler(async (req: any, res) => {
  const { name, price, image, brand, category, countInStock, description } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    product.description = description

    const createdProduct = await product.save()
    res.status(201).json({
      resultCode: 1,
      errorMessage: [],
      data: createdProduct,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Product not found'],
      data: null,
    })
  }
})

// @desc     Get all orders
// @route    GET /api/order
// @access   Private & Admin
export const getAllOrders = asyncHandler(async (req: any, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
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

// @desc     Update order to paid
// @route    GET /api/order/:id/pay
// @access   Private
export const updateOrderToPaid = asyncHandler(async (req: any, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    const { id, status, updateTime } = req.body
    order.isPaid = true
    order.paidAt = Date.now()

    // THis stuff coming from paypal - frontend
    order.paymentResult = {
      id,
      status,
      updateTime,
      emailAddress: 'Set to req.body.payer.email_address',
    }

    const updatedOrder = await order.save()

    res.status(201).json({
      resultCode: 1,
      errorMessage: [],
      data: updatedOrder,
    })
  } else {
    res.status(404).json({
      resultCode: 1,
      errorMessage: ['Order not found'],
      data: null,
    })
  }
})

// @desc     Update order to delivered
// @route    GET /api/order/:id/delivered
// @access   Private & Admin
export const updateOrderToDelivered = asyncHandler(async (req: any, res) => {
  const order = await Order.findById(req.params.id)

  if (order && order.isPaid) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()
    if (updatedOrder) {
      res.status(201).json({
        resultCode: 1,
        errorMessage: [],
        data: updatedOrder,
      })
    } else {
      res.status(500).json({
        resultCode: 0,
        errorMessage: ['Order status has not been updated'],
        data: null,
      })
    }
  } else if (!order) {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Order not found'],
      data: null,
    })
  } else if (!order.isPaid) {
    res.status(400).json({
      resultCode: 0,
      errorMessage: ['Order must be payed before you can change delivery status.'],
      data: null,
    })
  }
})
