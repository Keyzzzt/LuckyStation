import express, { Router } from 'express'
import { createNewOrder, getOrderById, getOwnOrders } from '@src/Controllers/order.controller'
import { privateRoute } from '@src/middleware/auth.middleware'

const router: Router = express.Router()

router.route('/').post(privateRoute, createNewOrder)
router.route('/myorders').get(privateRoute, getOwnOrders)
router.route('/:id').get(privateRoute, getOrderById)
router.route('/:id/delivered')

export default router
