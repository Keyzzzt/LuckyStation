import asyncHandler from 'express-async-handler'
import { Product } from '@src/Models/ProductModel'

// @desc     Fetch all products
// @route    GET /api/product
// @access   Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}) // Returns promise, pass in an empty object gives everything
  if (products) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: products,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Products not found'],
      data: null,
    })
  }
})

// @desc     Fetch single product
// @route    GET /api/product/:id
// @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id) // Returns promise, pass in an empty object gives everything
  if (product) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: product,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Product not found'],
      data: null,
    })
  }
})

export { getAllProducts, getProductById }
