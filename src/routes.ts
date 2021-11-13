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

function routes(app: Express) {
  // Sessions //TODO Поменять адреса на auth вместо sessions
  app.get('/api/auth', deserializeUser, privateRoute, auth)
  app.post('/api/auth', validateDTO(loginV), login, auth)
  app.post('/api/auth/reg', validateDTO(regV), register)
  app.delete('/api/auth', deserializeUser, privateRoute, logout)
  app.get('/api/auth/google', googleOAuth)

  // Users
  app.get('/api/user/profile', deserializeUser, privateRoute, getProfile)
  app.put('/api/user/profile', validateDTO(updateProfileByUserOrAdminV), deserializeUser, privateRoute, updateProfile)

  // Admin
  app.get('api/user', deserializeUser, adminRoute, getAllUsersByAdmin)
  app.get('api/user/:id', deserializeUser, adminRoute, getUserByAdmin)
  app.put('api/user/:id', validateDTO(updateProfileByUserOrAdminV), deserializeUser, adminRoute, updateUserProfileByAdmin)
  app.delete('api/user/:id', deserializeUser, adminRoute, deleteUserByAdmin)

  app.get('api/order', deserializeUser, adminRoute, getAllOrders)
  app.get('api/order/:id/pay', deserializeUser, adminRoute, setOrderToPaid)
  app.delete('api/order/:id/pay', deserializeUser, adminRoute, setOrderToNotPaid)
  app.get('api/order/:id/delivered', deserializeUser, adminRoute, setOrderToDelivered)
  app.delete('api/order/:id/delivered', deserializeUser, adminRoute, setOrderToNotDelivered)

  app.post('api/product', validateDTO(createAndUpdateProductV), deserializeUser, adminRoute, createProduct)
  app.put('api/product/:id', validateDTO(createAndUpdateProductV), deserializeUser, adminRoute, updateProduct)
  app.delete('api/product/:id', deserializeUser, adminRoute, deleteProduct)

  // Order
  app.post('api/order', validateDTO(createNewOrderV), deserializeUser, privateRoute, createNewOrder)
  app.get('api/order/myorders', deserializeUser, privateRoute, getOwnOrders)
  app.get('api/order/:id', deserializeUser, privateRoute, getOrderById)

  // Product
  app.get('api/product', getProducts)
  app.post('api/product/:id/review', validateDTO(createReviewV), deserializeUser, privateRoute, createReview)
  app.get('api/product/:id', getProductById)
}

export default routes
