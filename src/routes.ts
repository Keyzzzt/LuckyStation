import * as Auth from '@src/Controllers/auth.controller'
import * as Admin from '@src/Controllers/admin.controller'
import * as User from '@src/Controllers/user.controller'
import * as Order from '@src/Controllers/order.controller'
import * as Product from '@src/Controllers/product.controller'
import * as Validation from '@src/validationSchemas'
import { privateRoute, adminRoute, paginatedResult } from '@src/middleware'
import { UserModel } from './models/user.model'
import { ProductModel } from './models/product.model'
import { OrderModel } from './models/order.model'
import { SurveyModel } from './models/survey.model'

export function routes(app) {
  app.post('/api/login', Validation.auth, Auth.login)
  app.post('/api/registration', Validation.auth, Auth.register)
  app.post('/api/logout', Auth.logout)
  app.get('/api/auth/google/redirect', Auth.googleOAuthRedirect)
  app.get('/api/auth/google', Auth.googleOAuth)
  app.get('/api/activate/:link', Auth.activate)
  app.get('/api/refresh', Auth.refresh)

  // ADMIN
  app.get('/api/admin/user/:page/:limit', privateRoute, adminRoute, paginatedResult(UserModel, null), Admin.getAllUsers)
  app.get('/api/admin/user/:id', privateRoute, adminRoute, Admin.getUser)
  app.put('/api/admin/user/:id', Validation.updateProfileByAdmin, privateRoute, adminRoute, Admin.updateUserProfile)
  app.delete('/api/admin/user/:_id', privateRoute, adminRoute, Admin.deleteUser)

  app.get('/api/admin/order/:page/:limit', privateRoute, adminRoute, paginatedResult(OrderModel, null), Admin.getAllOrders)
  app.get('/api/admin/order/:id/pay', privateRoute, adminRoute, Admin.setOrderToPaid)
  app.delete('/api/admin/order/:id/pay', privateRoute, adminRoute, Admin.setOrderToNotPaid)
  app.get('/api/admin/order/:id/delivered', privateRoute, adminRoute, Admin.setOrderToDelivered)
  app.delete('/api/admin/order/:id/delivered', privateRoute, adminRoute, Admin.setOrderToNotDelivered)

  app.post('/api/admin/product', Validation.createAndUpdateProduct, privateRoute, adminRoute, Admin.createProduct)
  app.put('/api/admin/product/:id', Validation.createAndUpdateProduct, privateRoute, adminRoute, Admin.updateProduct)
  app.delete('/api/admin/product/:id', privateRoute, adminRoute, Admin.deleteProduct)

  app.get('/api/admin/survey/:page/:limit', privateRoute, adminRoute, paginatedResult(SurveyModel, null), Admin.getAllSurveys)
  app.get('/api/admin/survey/:id', privateRoute, adminRoute, Admin.getSurveyById)
  app.post('/api/admin/survey', Validation.createSurvey, privateRoute, adminRoute, Admin.createSurvey)
  app.post('/api/admin/survey/webhook', Admin.manageSendgridEvents)
  app.get('/api/survey/:surveyId/:choice', (req, res) => {
    res.send('Thanks')
  })

  app.get('/api/user/profile', privateRoute, User.getProfile)
  app.put('/api/user/profile', Validation.updateProfileByUser, privateRoute, User.updateProfile)
  app.post('/api/user/favorite/:id', privateRoute, User.addToFavorite)
  app.delete('/api/user/favorite/:id', privateRoute, User.removeFromFavorite)

  app.post('/api/order', Validation.createOrder, Order.createNewOrder)
  app.get('/api/order/myorders/:page/:limit', privateRoute, paginatedResult(OrderModel, 'own'), Order.getOwnOrders)
  app.get('/api/order/:id', privateRoute, Order.getOrderById)
  app.post('/api/order/:id/pay', privateRoute, Order.setOrderToPaid)

  app.get('/api/product/:page/:limit', paginatedResult(ProductModel, null), Product.getProducts)
  app.post('/api/product/:id/review', Validation.createReview, privateRoute, Product.createReview)
  app.get('/api/product/:id', Product.getProductById)

  app.get('/api/config/paypal', User.getPayPalClientId)
}
