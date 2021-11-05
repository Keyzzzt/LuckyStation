import express, { Router } from 'express'
import { getProducts, getProductById, createReview } from '@src/Controllers/product.controller'
import { privateRoute } from '@src/middleware/auth.middleware'

const router: Router = express.Router()

router.route('/').get(getProducts)
router.route('/:id/review').post(privateRoute, createReview)
router.route('/:id').get(getProductById)

export default router
