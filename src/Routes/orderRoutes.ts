import express from 'express'
import { createNewOrder, getOrderById, getOwnOrders } from '@src/Controllers/orderController'
import { getAllOrders, updateOrderToPaid, updateOrderToDelivered } from '@src/Controllers/adminController'
import { privateRoute, adminRoute } from '@src/middleware/authMiddleware'

const router = express.Router()

router.route('/').post(privateRoute, createNewOrder).get(privateRoute, adminRoute, getAllOrders)
router.route('/myorders').get(privateRoute, getOwnOrders)
router.route('/:id').get(privateRoute, getOrderById)
router.route('/:id/pay').get(privateRoute, adminRoute, updateOrderToPaid)
router.route('/:id/delivered').get(privateRoute, adminRoute, updateOrderToDelivered)

export default router
