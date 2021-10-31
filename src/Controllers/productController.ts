import asyncHandler from 'express-async-handler'
import { Product } from '@src/Models/ProductModel'

// @desc     Fetch all products
// @route    GET /api/products
// @access   Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}) // Returns promise, pass in an empty object gives everything
  if (products) {
    res.status(200).json({
      errorMessage: [],
      resultCode: 1,
      data: products,
    })
  } else {
    res.status(404)
    throw new Error('No products found')
  }
})

// @desc     Fetch single product
// @route    GET /api/products/:id
// @access   Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id) // Returns promise, pass in an empty object gives everything
  if (product) {
    res.status(200).json({
      errorMessage: [],
      resultCode: 1,
      data: product,
    })
  } else {
    res.status(404)
    throw new Error('No product found')
  }
})

export { getAllProducts, getProductById }
