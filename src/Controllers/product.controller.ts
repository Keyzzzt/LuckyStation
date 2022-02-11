/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Response } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { ProductModel, ReviewType } from '@src/models/product.model'
import ApiError from '@src/middleware/error.middleware'

// Frontend DONE
export async function getProducts(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(req.paginatedResponse)
  } catch (error) {
    return next(error.message)
  }
}

export async function getProductById(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const product = await ProductModel.findById(req.params.id).select('-__v')
    if (!product) {
      return next(ApiError.NotFound('Product not found'))
    }
    product.countViewed += 1
    await product.save()
    return res.status(200).json(product)
  } catch (error) {
    return next(error.message)
  }
}

export async function createReview(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { rating, comment } = req.body

    // FIXME: check if rating not between 1 and 5
    const product = await ProductModel.findById(req.params.id)
    if (!product) {
      return next(ApiError.NotFound('Product not found'))
    }

    const alreadyReviewed = product.reviews.find(
      // @ts-ignore
      r => r.user._id.toString() === req.user.id.toString()
    )
    if (alreadyReviewed) {
      return next(ApiError.BadRequest('Product already reviewed'))
    }

    let normalizedRating

    if (rating < 0) {
      normalizedRating = 0
    } else if (rating > 5) {
      normalizedRating = 5
    } else {
      normalizedRating = rating
    }

    const review: ReviewType = {
      rating: Number(normalizedRating),
      user: req.user._id,
      comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating = product.reviews.reduce((acc, elem) => elem.rating + acc, 0) / product.reviews.length
    await product.save()
    return res.status(201).json({
      data: product,
    })
  } catch (error) {
    return next(error.message)
  }
}
