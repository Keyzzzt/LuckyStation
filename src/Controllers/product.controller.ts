/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { ProductModel, ReviewType } from '@src/models/product.model'
import { ApiError } from '@src/middleware/error.middleware'

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: remove any
    const keyword: any = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}

    const products = await ProductModel.find({ ...keyword }).populate('user', 'id name')
    if (!products || products.length === 0) throw ApiError.BadRequest('Products not found')

    return res.status(200).json({
      data: products,
    })
  } catch (error) {
    return next(error.message)
  }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await ProductModel.findById(req.params.id)
    if (!product) throw ApiError.BadRequest('Product not found')

    return res.status(200).json({
      data: product,
    })
  } catch (error) {
    return next(error.message)
  }
}

// @desc     Create review
// @route    POST /api/product/:id/review
// @access   Private
export const createReview = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))

    const { rating, comment } = req.body

    // FIXME: check if rating not between 1 and
    const product = await ProductModel.findById(req.params.id)
    if (!product) throw ApiError.BadRequest('Product not found')

    // TODO: remove ts-ignore
    const alreadyReviewed = product.reviews.find(
      // @ts-ignore
      (r) => r.user._id.toString() === req.user.id.toString()
    )
    if (alreadyReviewed) {
      throw ApiError.BadRequest('Product already reviewed')
    }

    const review: ReviewType = {
      rating: Number(rating),
      user: req.user.id,
      comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, elem) => elem.rating + acc, 0) / product.reviews.length
    await product.save()
    return res.status(201).json({
      data: product,
    })
  } catch (error) {
    return next(error.message)
  }
}
