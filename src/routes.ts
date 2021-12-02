/* eslint-disable prettier/prettier */
import * as Auth from '@src/Controllers/auth.controller'
import * as Admin from '@src/Controllers/admin.controller'
import * as User from '@src/Controllers/user.controller'
import * as Order from '@src/Controllers/order.controller'
import * as Product from '@src/Controllers/product.controller'
import * as Validation from '@src/middleware/validationSchemas'
import { deserializeUser, privateRoute, adminRoute } from '@src/middleware/auth.middleware'

export function routes(app) {
  app.post('/api/login', Validation.auth, Auth.login)
  app.post('/api/registration', Validation.auth, Auth.register)
  app.post('/api/logout', Auth.logout)
  app.get('/api/auth/google/redirect', Auth.googleOAuthRedirect)
  app.get('/api/auth/google', Auth.googleOAuth)
  app.get('/api/activate/:link', Auth.activate)
  app.get('/api/refresh', Auth.refresh)

  app.get('/api/admin/user', deserializeUser, privateRoute, adminRoute, Admin.getAllUsers)
  app.get('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, Admin.getUser)
  app.put(
    '/api/admin/user/:id',
    Validation.updateProfileByAdmin,
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.updateUserProfile
  )
  app.delete('/api/admin/user/:id', deserializeUser, privateRoute, adminRoute, Admin.deleteUser)

  app.get('/api/admin/order', deserializeUser, privateRoute, adminRoute, Admin.getAllOrders)
  app.get(
    '/api/admin/order/:id/pay',
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.setOrderToPaid
  )
  app.delete(
    '/api/admin/order/:id/pay',
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.setOrderToNotPaid
  )
  app.get(
    '/api/admin/order/:id/delivered',
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.setOrderToDelivered
  )
  app.delete(
    '/api/admin/order/:id/delivered',
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.setOrderToNotDelivered
  )

  /**
   * ! Product
   */
  app.post(
    '/api/admin/product',
    Validation.createAndUpdateProduct,
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.createProduct
  )
  app.put(
    '/api/admin/product/:id',
    Validation.createAndUpdateProduct,
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.updateProduct
  )
  app.delete(
    '/api/admin/product/:id',
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.deleteProduct
  )
  /**
   * ! Survey
   */

  app.get('/api/admin/survey', deserializeUser, privateRoute, adminRoute, Admin.getAllSurveys)
  app.get('/api/admin/survey/:id', deserializeUser, privateRoute, adminRoute, Admin.getSurveyById)
  app.post(
    '/api/admin/survey',
    Validation.createSurvey,
    deserializeUser,
    privateRoute,
    adminRoute,
    Admin.createSurvey
  )
  app.post('/api/admin/survey/webhook', Admin.manageSendgridEvents)
  // TODO:
  app.get('/api/survey/:surveyId/:choice', (req, res) => {
    res.send('Thanks')
  })

  app.get('/api/user/profile', deserializeUser, privateRoute, User.getProfile)
  app.put(
    '/api/user/profile',
    Validation.updateProfileByUser,
    deserializeUser,
    privateRoute,
    User.updateProfile
  )

  app.post(
    '/api/order',
    Validation.createOrder,
    deserializeUser,
    privateRoute,
    Order.createNewOrder
  )
  app.get('/api/order/myorders', deserializeUser, privateRoute, Order.getOwnOrders)
  app.get('/api/order/:id', deserializeUser, privateRoute, Order.getOrderById)

  app.get('/api/product', Product.getProducts)
  app.post(
    '/api/product/:id/review',
    Validation.createReview,
    deserializeUser,
    privateRoute,
    Product.createReview
  )
  app.get('/api/product/:id', Product.getProductById)
}
