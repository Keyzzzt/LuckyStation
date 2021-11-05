import express, { Router } from 'express'
import {
  getAllUsersByAdmin,
  deleteUserByAdmin,
  getUserByAdmin,
  updateUserProfileByAdmin,
  setOrderToPaid,
  setOrderToNotPaid,
  getAllOrders,
  createProduct,
  deleteProduct,
  updateProduct,
  setOrderToDelivered,
  setOrderToNotDelivered,
} from '@src/Controllers/admin.controller'
import { privateRoute, adminRoute } from '@src/middleware/auth.middleware'

const router: Router = express.Router()

router.route('/user').get(privateRoute, adminRoute, getAllUsersByAdmin)
router
  .route('/user/:id')
  .delete(privateRoute, adminRoute, deleteUserByAdmin)
  .get(privateRoute, adminRoute, getUserByAdmin)
  .put(privateRoute, adminRoute, updateUserProfileByAdmin)

router.route('/order').get(privateRoute, adminRoute, getAllOrders)
router.route('/order/:id/pay').get(privateRoute, adminRoute, setOrderToPaid).delete(privateRoute, adminRoute, setOrderToNotPaid)
router.route('/order/:id/delivered').get(privateRoute, adminRoute, setOrderToDelivered).delete(privateRoute, adminRoute, setOrderToNotDelivered)

router.route('/product').post(privateRoute, adminRoute, createProduct)
router.route('/product/:id').delete(privateRoute, adminRoute, deleteProduct).put(privateRoute, adminRoute, updateProduct)

export default router
