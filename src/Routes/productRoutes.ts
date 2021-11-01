import express from 'express'
import { getAllProducts, getProductById } from '@src/Controllers/productController'
import { privateRoute, adminRoute } from '@src/middleware/authMiddleware'
import { deleteProduct, createProduct, updateProduct } from '@src/Controllers/adminController'

const router = express.Router()

router.route('/').get(getAllProducts).post(privateRoute, adminRoute, createProduct)
router.route('/:id').get(getProductById).delete(privateRoute, adminRoute, deleteProduct).put(privateRoute, adminRoute, updateProduct)

export default router
