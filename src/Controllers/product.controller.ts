/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express'
import { ID } from '@src/Types'
import { findProduct } from '@src/services/product.services'
import { issueStatusCode } from '@src/middleware/issueStatusCode'

type CreateReviewBody = {
  rating: number
  comment: string
}

// @desc     Fetch all products
// @route    GET /api/product
// @access   Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {}

    const products = await findProduct({ ...keyword }, 'all')
    if (!products || products.length === 0) throw new Error('Products not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: products,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getProducts controller'],
      data: null,
    })
  }
}

// @desc     Fetch single product
// @route    GET /api/product/:id
// @access   Public
export const getProductById = async (req: Request<ID>, res: Response) => {
  try {
    const product = await findProduct(req.params.id, 'id')
    if (!product) throw new Error('Product not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: product,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getProductById controller'],
      data: null,
    })
  }
}

// @desc     Create review
// @route    POST /api/product/:id/review
// @access   Private
export const createReview = async (req: Request<ID, any, CreateReviewBody, any>, res: Response) => {
  try {
    const { rating, comment } = req.body
    const product = await findProduct(req.params.id, 'id')
    if (!product) throw new Error('Product not found')

    const alreadyReviewed = product.reviews.find((r) => r.user._id.toString() === res.locals.user._id.toString())
    if (alreadyReviewed) {
      throw new Error('Product already reviewed')
    } else {
      const review = {
        name: res.locals.user.name,
        rating: Number(rating),
        user: res.locals.user,
        comment,
      }

      product.reviews.push(review)
      product.numReviews = product.reviews.length
      product.rating = product.reviews.reduce((acc, elem) => elem.rating + acc, 0) / product.reviews.length
      const result = await product.save()
      if (result) {
        res.status(201).json({
          resultCode: 1,
          errorMessage: [],
          data: product,
        })
      } else {
        throw new Error('Server error')
      }
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'createReview controller'],
      data: null,
    })
  }
}
