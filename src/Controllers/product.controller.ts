/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
import { RequestCustom } from '@src/custom'
import { ProductModel } from '@src/models/product.model'
import { ApiError } from '@src/exceptions/api.error'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}

    const products = await ProductModel.find({ ...keyword }).populate('user', 'id name')
    if (!products || products.length === 0) throw ApiError.BadRequest('Products not found')

    res.status(200).json({
      resultCode: 1,
      message: '',
      data: products,
    })
  } catch (error) {
    next(error.message)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await ProductModel.findById(req.params.id)
    if (!product) throw ApiError.BadRequest('Product not found')

    res.status(200).json({
      resultCode: 1,
      message: '',
      data: product,
    })
  } catch (error) {
    next(error.message)
  }
}

// @desc     Create review
// @route    POST /api/product/:id/review
// @access   Private
export const createReview = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body
    const product = await ProductModel.findById(req.params.id)
    if (!product) throw ApiError.BadRequest('Product not found')

    const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === req.user.id.toString())
    if (alreadyReviewed) throw ApiError.BadRequest('Product already reviewed')

    const review = {
      rating: Number(rating),
      user: req.user.id,
      comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((acc, elem) => elem.rating + acc, 0) / product.reviews.length
    await product.save()
    res.status(201).json({
      resultCode: 1,
      message: '',
      data: product,
    })
  } catch (error) {
    next(error.message)
  }
}
