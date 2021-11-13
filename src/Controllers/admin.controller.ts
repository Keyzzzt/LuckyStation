/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '@src/models/product.model'
import { OrderModel } from '@src/models/order.model'
import { findUser } from '@src/services/user.services'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { findProduct } from '@src/services/product.services'
import { findOrder } from '@src/services/order.services'

// @desc     Get all users by Admin
// @route    GET /api/user
// @access   Private & Admin
export const getAllUsersByAdmin = async (req: Request, res: Response) => {
  try {
    const users = await findUser({}, 'all')
    if (!users) throw new Error('User not found')
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: users,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'login controller'],
      data: null,
    })
  }
}

// @desc     Delete user by Id
// @route    DELETE /api/user/:id
// @access   Private & Admin
export const deleteUserByAdmin = async (req: Request, res: Response) => {
  try {
    const user = await findUser({ _id: req.params.id }, 'id')
    if (!user) throw new Error('User not found')
    const removedUser = await user.remove()
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: null,
    })
    if (!removedUser) {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'deleteUserByAdmin controller'],
      data: null,
    })
  }
}

// @desc     Get user by ID
// @route    GET /api/user/:id
// @access   Private & Admin
export const getUserByAdmin = async (req: Request, res: Response) => {
  try {
    const user = await findUser({ _id: req.params.id }, 'id')
    if (!user) throw new Error('User not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: user,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getUserByAdmin controller'],
      data: null,
    })
  }
}

// @desc     Change user profile by Admin
// @route    PUT /api/user/:id
// @access   Private & Admin
export const updateUserProfileByAdmin = async (req: Request, res: Response) => {
  try {
    const user = await findUser({ _id: req.params.id }, 'id')
    if (!user) throw new Error('User not found')

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    if (updatedUser) {
      res.status(200).json({
        resultCode: 1,
        errorMessage: [],
        data: updatedUser,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'updateUserProfileByAdmin controller'],
      data: null,
    })
  }
}

// @desc     Delete a product
// @route    DELETE /api/product/:id
// @access   Private & Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await findProduct(req.params.id, 'id')
    if (!product) throw new Error('Product not found')

    const result = await product.remove()
    if (result) {
      res.status(200).json({
        resultCode: 1,
        errorMessage: [],
        data: null,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'deleteProduct controller'],
      data: null,
    })
  }
}

// @desc     Create a product
// @route    POST /api/product
// @access   Private & Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, image, brand, category, countInStock, description } = req.body
    const product = new ProductModel({
      name,
      price,
      // @ts-ignore
      user: req.user._id,
      image,
      brand,
      category,
      countInStock,
      description,
    })

    const createdProduct = await product.save()

    if (createdProduct) {
      res.status(201).json({
        resultCode: 1,
        errorMessage: [],
        data: createdProduct,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'createProduct controller'],
      data: null,
    })
  }
}

// @desc     Update a product
// @route    PUT /api/product/:id
// @access   Private & Admin
// TODO remove asyncHandler, add try catch
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, image, brand, category, countInStock, description } = req.body

  const product = await findProduct(req.params.id, 'id')
  if (!product) throw new Error('Product not found')

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
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await findOrder({}, 'all')
    if (!orders || orders.length === 0) throw new Error('Order not found')
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: orders,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getAllOrders controller'],
      data: null,
    })
  }
}

// @desc     Update order to paid
// @route    GET /api/order/:id/pay
// @access   Private & Admin

// TODO define body type for id, status, updateTime which will come from PayPal
// TODO Validation
export const setOrderToPaid = async (req: Request, res: Response) => {
  try {
    const { id, status, updateTime } = req.body
    const order = await findOrder(req.params.id, 'id')
    if (!order) throw new Error('Order not found')

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

    if (updatedOrder) {
      res.status(201).json({
        resultCode: 1,
        errorMessage: [],
        data: updatedOrder,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'setOrderToPaid controller'],
      data: null,
    })
  }
}

// @desc     Set order to - NOT PAID
// @route    PUT /api/order/:id/pay
// @access   Private & Admin
export const setOrderToNotPaid = async (req: Request, res: Response) => {
  try {
    const order = await findOrder(req.params.id, 'id')
    if (!order) throw new Error('Order not found')

    order.isPaid = false
    order.paidAt = undefined
    order.paymentResult = {
      id: '',
      status: '',
      updateTime: '',
      emailAddress: '',
    }

    const updatedOrder = await order.save()
    if (updatedOrder) {
      res.status(201).json({
        resultCode: 1,
        errorMessage: [],
        data: updatedOrder,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'setOrderToNotPaid controller'],
      data: null,
    })
  }
}

// @desc     Set order to delivered
// @route    GET /api/order/:id/delivered
// @access   Private & Admin
export const setOrderToDelivered = async (req: Request, res: Response) => {
  try {
    const order = await findOrder(req.params.id, 'id')
    if (!order) throw new Error('Order not found')

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
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'setOrderToDelivered controller'],
      data: null,
    })
  }
}

// @desc     Set order to NOT delivered
// @route    PUT /api/order/:id/delivered
// @access   Private & Admin
export const setOrderToNotDelivered = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findById(req.params.id)
    if (!order) throw new Error('Order not found')

    order.isDelivered = false
    order.deliveredAt = undefined
    const updatedOrder = await order.save()

    if (updatedOrder) {
      res.status(201).json({
        resultCode: 1,
        errorMessage: [],
        data: updatedOrder,
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'setOrderToDelivered controller'],
      data: null,
    })
  }
}
