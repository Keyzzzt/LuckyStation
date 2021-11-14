import { Express } from 'express'
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
import { googleOAuth, login, auth, logout, register } from '@src/Controllers/session.controller'
import { deserializeUser, privateRoute, adminRoute } from '@src/middleware/auth.middleware'
import { getProfile, updateProfile } from '@src/Controllers/user.controller'
import { createNewOrder, getOrderById, getOwnOrders } from '@src/Controllers/order.controller'
import { getProducts, getProductById, createReview } from '@src/Controllers/product.controller'
import { validateDTO, loginV, regV, updateProfileByUserOrAdminV, createAndUpdateProductV, createNewOrderV, createReviewV } from '@src/validateDTO'

export function routes(app: Express) {
  // // Sessions
  app.get('/api/auth', deserializeUser, auth)
  app.post('/api/auth', validateDTO(loginV), login)
  app.post('/api/auth/reg', validateDTO(regV), register)
  app.delete('/api/auth', deserializeUser, privateRoute, logout)
  app.get('/api/auth/google', googleOAuth)

  // Users
  app.get('/api/user/profile', deserializeUser, privateRoute, getProfile)
  app.put('/api/user/profile', validateDTO(updateProfileByUserOrAdminV), deserializeUser, privateRoute, updateProfile)

  // Admin
  app.get('/api/admin/user', deserializeUser, privateRoute, adminRoute, getAllUsersByAdmin)
  app.get('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, getUserByAdmin)
  app.put('/api/admin/user/:id', validateDTO(updateProfileByUserOrAdminV), deserializeUser, privateRoute, adminRoute, updateUserProfileByAdmin)
  app.delete('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, deleteUserByAdmin)

  app.get('/api/admin/order', deserializeUser, privateRoute, adminRoute, getAllOrders)
  app.get('/api/admin/order/:id/pay', deserializeUser, privateRoute, adminRoute, setOrderToPaid)
  app.delete('/api/admin/order/:id/pay', deserializeUser, privateRoute, adminRoute, setOrderToNotPaid)
  app.get('/api/admin/order/:id/delivered', deserializeUser, privateRoute, adminRoute, setOrderToDelivered)
  app.delete('/api/admin/order/:id/delivered', deserializeUser, privateRoute, adminRoute, setOrderToNotDelivered)

  app.post('/api/admin/product', validateDTO(createAndUpdateProductV), deserializeUser, privateRoute, adminRoute, createProduct)
  app.put('/api/admin/product/:id', validateDTO(createAndUpdateProductV), deserializeUser, privateRoute, adminRoute, updateProduct)
  app.delete('/api/admin/product/:id', deserializeUser, privateRoute, adminRoute, deleteProduct)

  // Order
  app.post('/api/order', validateDTO(createNewOrderV), deserializeUser, privateRoute, createNewOrder)
  app.get('/api/order/myorders', deserializeUser, privateRoute, getOwnOrders)
  app.get('/api/order/:id', deserializeUser, privateRoute, getOrderById)

  // Product
  app.get('/api/product', getProducts)
  app.post('/api/product/:id/review', validateDTO(createReviewV), deserializeUser, privateRoute, createReview)
  app.get('/api/product/:id', getProductById)
}
