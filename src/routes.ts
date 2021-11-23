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
  createSurvey,
  getAllSurveys,
  manageSendgridEvents,
} from '@src/Controllers/admin.controller'
import { login, logout, register, activate, refresh, googleOAuth } from '@src/Controllers/auth.controller'
import { deserializeUser, privateRoute, adminRoute } from '@src/middleware/auth.middleware'
import { getProfile, updateProfile } from '@src/Controllers/user.controller'
import { createNewOrder, getOrderById, getOwnOrders } from '@src/Controllers/order.controller'
import { getProducts, getProductById, createReview } from '@src/Controllers/product.controller'

export function routes(app: Express) {
  // Authorization
  app.post('/api/login', login) // OK
  app.post('/api/registration', register) // OK
  app.post('/api/logout', logout) // OK
  app.get('/api/auth/google', googleOAuth)
  app.get('/api/activate/:link', activate)
  app.get('/api/refresh', refresh)

  // Users
  app.get('/api/user/profile', deserializeUser, privateRoute, getProfile)
  app.put('/api/user/profile', deserializeUser, privateRoute, updateProfile)

  // Admin
  app.get('/api/admin/user', deserializeUser, privateRoute, adminRoute, getAllUsersByAdmin)
  app.get('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, getUserByAdmin)
  app.put('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, updateUserProfileByAdmin)
  app.delete('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, deleteUserByAdmin)

  app.get('/api/admin/order', deserializeUser, privateRoute, adminRoute, getAllOrders)
  app.get('/api/admin/order/:id/pay', deserializeUser, privateRoute, adminRoute, setOrderToPaid)
  app.delete('/api/admin/order/:id/pay', deserializeUser, privateRoute, adminRoute, setOrderToNotPaid)
  app.get('/api/admin/order/:id/delivered', deserializeUser, privateRoute, adminRoute, setOrderToDelivered)
  app.delete('/api/admin/order/:id/delivered', deserializeUser, privateRoute, adminRoute, setOrderToNotDelivered)

  app.post('/api/admin/product', deserializeUser, privateRoute, adminRoute, createProduct)
  app.put('/api/admin/product/:id', deserializeUser, privateRoute, adminRoute, updateProduct)
  app.delete('/api/admin/product/:id', deserializeUser, privateRoute, adminRoute, deleteProduct)

  app.get('/api/admin/survey', deserializeUser, privateRoute, adminRoute, getAllSurveys)
  app.post('/api/admin/survey', deserializeUser, privateRoute, adminRoute, createSurvey)
  app.post('/api/admin/survey/webhook', manageSendgridEvents)
  app.get('/api/survey/:surveyId/:choice', (req, res) => {
    res.send('Thanks')
  })

  // Order
  app.post('/api/order', deserializeUser, privateRoute, createNewOrder)
  app.get('/api/order/myorders', deserializeUser, privateRoute, getOwnOrders)
  app.get('/api/order/:id', deserializeUser, privateRoute, getOrderById)

  // Product
  app.get('/api/product', getProducts)
  app.post('/api/product/:id/review', deserializeUser, privateRoute, createReview)
  app.get('/api/product/:id', getProductById)
}
