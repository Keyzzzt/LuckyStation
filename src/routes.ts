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
import {
  googleOauth,
  createSessionHandler,
  getSessionController,
  deleteSessionHandler,
  commonRegistration,
} from '@src/Controllers/session.controller'
import { privateRoute, adminRoute } from '@src/middleware/auth.middleware'
import { getProfile, updateProfile } from '@src/Controllers/user.controller'
import { createNewOrder, getOrderById, getOwnOrders } from '@src/Controllers/order.controller'
import { getProducts, getProductById, createReview } from '@src/Controllers/product.controller'

function routes(app: Express) {
  // Sessions
  app.get('/api/sessions', privateRoute, getSessionController)
  app.post('/api/sessions', createSessionHandler, getSessionController)
  app.post('/api/sessions/reg', commonRegistration)
  app.delete('/api/sessions', privateRoute, deleteSessionHandler)
  app.get('/api/sessions/oauth/google', googleOauth)

  // Users
  app.get('/api/user/profile', privateRoute, getProfile)
  app.put('/api/user/profile', privateRoute, updateProfile)

  // Admin
  app.get('api/user', privateRoute, adminRoute, getAllUsersByAdmin)
  app.get('api/user/:id', privateRoute, adminRoute, getUserByAdmin)
  app.put('api/user/:id', privateRoute, adminRoute, updateUserProfileByAdmin)
  app.delete('api/user/:id', privateRoute, adminRoute, deleteUserByAdmin)

  app.get('api/order', privateRoute, adminRoute, getAllOrders)
  app.get('api/order/:id/pay', privateRoute, adminRoute, setOrderToPaid)
  app.delete('api/order/:id/pay', privateRoute, adminRoute, setOrderToNotPaid)
  app.get('api/order/:id/delivered', privateRoute, adminRoute, setOrderToDelivered)
  app.delete('api/order/:id/delivered', privateRoute, adminRoute, setOrderToNotDelivered)

  app.post('api/product', privateRoute, adminRoute, createProduct)
  app.put('api/product/:id', privateRoute, adminRoute, updateProduct)
  app.delete('api/product/:id', privateRoute, adminRoute, deleteProduct)

  // Order
  app.post('api/order', privateRoute, createNewOrder)
  app.get('api/order/myorders', privateRoute, getOwnOrders)
  app.get('api/order/:id', privateRoute, getOrderById)

  // Product
  app.get('api/product', getProducts)
  app.post('api/product/:id/review', privateRoute, createReview)
  app.get('api/product/:id', getProductById)
}

export default routes
