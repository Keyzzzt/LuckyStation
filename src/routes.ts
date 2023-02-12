/* eslint-disable prettier/prettier */
import { getApiInfo } from '@src/documentation'
import * as Auth from '@src/Controllers/auth.controller'
import * as Gallery from '@src/Controllers/gallery.controller'
import * as Admin from '@src/Controllers/admin.controller'
import * as User from '@src/Controllers/user.controller'
import * as Order from '@src/Controllers/order.controller'
import * as Product from '@src/Controllers/product.controller'
import * as Validation from '@src/validationSchemas'
import { privateRoute, adminRoute, paginatedResult } from '@src/middleware'
import { UserModel } from './models/user.model'
import { ProductModel } from './models/product.model'
import { OrderModel } from './models/order.model'
import { getConfig } from './Controllers/config.controller'

export function routes(app) {
  app.get('/api/config', getConfig)
  app.get('/api/apiinfo', getApiInfo)

  app.post('/api/login', Validation.auth, Auth.login)
  app.post('/api/registration', Validation.auth, Auth.register)
  app.post('/api/logout', Auth.logout)
  app.get('/api/auth/google/redirect', Auth.googleOAuthRedirect)
  app.get('/api/auth/google', Auth.googleOAuth)
  app.get('/api/activate/:token', Auth.activate)
  app.post('/api/recovery', Validation.emailOnly, Auth.passwordRecoveryLink)
  app.put('/api/recovery', Validation.password_confirm, Auth.passwordReset)
  app.get('/api/refresh', Auth.refresh)

  // ADMIN

  app.get('/api/admin/user/:page/:limit', privateRoute, adminRoute, paginatedResult(UserModel, null), Admin.getAllUsers)
  app.get('/api/admin/user/:id', privateRoute, adminRoute, Admin.getUser)
  app.put('/api/admin/user/:id', Validation.updateProfileByAdmin, privateRoute, adminRoute, Admin.setUsersAdminStatus)
  app.delete('/api/admin/user/:id', privateRoute, adminRoute, Admin.deleteUser)
  app.post('/api/admin/terms', privateRoute, adminRoute, Admin.termsAndConditions)

  // Gallery
  app.post('/api/admin/gallery', privateRoute, adminRoute, Gallery.addGalleryItem)
  app.put('/api/admin/gallery/:id', privateRoute, adminRoute, Gallery.updateGalleryItem)
  app.get('/api/gallery', Gallery.getGalleryItems)
  app.get('/api/gallery/:id', Gallery.getGallerySingleItem)
  app.delete('/api/admin/gallery/:id', Gallery.deleteGalleryItem)


  app.get(
    '/api/admin/order/:page/:limit',
    privateRoute,
    adminRoute,
    paginatedResult(OrderModel, null),
    Admin.getAllOrders,
  )
  app.post('/api/admin/order/:id/pay', privateRoute, adminRoute, Admin.setOrderToPaid)
  app.delete('/api/admin/order/:id/pay', privateRoute, adminRoute, Admin.setOrderToNotPaid)
  app.post('/api/admin/order/:id/delivered', privateRoute, adminRoute, Admin.setOrderToDelivered)
  app.delete('/api/admin/order/:id/delivered', privateRoute, adminRoute, Admin.setOrderToNotDelivered)

  app.post('/api/admin/product', Validation.createAndUpdateProduct, privateRoute, adminRoute, Admin.createProduct)
  app.put('/api/admin/product/:id', Validation.createAndUpdateProduct, privateRoute, adminRoute, Admin.updateProduct)
  app.delete('/api/admin/product/:id', privateRoute, adminRoute, Admin.deleteProduct)
  app.get('/api/admin/statistic', privateRoute, adminRoute, Admin.getStatistic)
  app.put('/api/admin/statistic/email', privateRoute, adminRoute, Validation.emailOnly, Admin.removeEmailFromList)


  app.get('/api/user/profile', privateRoute, User.getProfile)
  app.put('/api/user/profile', Validation.updateProfileByUser, privateRoute, User.updateProfile)
  app.post('/api/user/favorite/:id', User.addToFavorite)
  app.delete('/api/user/favorite/:id', User.removeFromFavorite)
  app.post('/api/user/subscribe', Validation.emailOnly, User.subscribe)
  app.delete('/api/user/subscribe', Validation.emailOnly, User.unSubscribe)
  app.get('/api/user/terms/:lang', User.getTermsAndConditions)

  app.post('/api/order', Validation.createOrder, Order.createNewOrder)
  app.get('/api/order/myorders/:page/:limit', privateRoute, paginatedResult(OrderModel, 'own'), Order.getOwnOrders)
  app.get('/api/order/:id', Order.getOrderById)
  app.get('/api/product/:page/:limit', paginatedResult(ProductModel, null), Product.getProducts)
  app.post('/api/product/:id/review', Validation.createReview, privateRoute, Product.createReview)
  app.get('/api/product/:id', Product.getProductById)
  app.get('/api/config/paypal', User.getPayPalClientId)
  app.post('/api/order/:orderId/pay', Validation.paypalPaymentResult, privateRoute, Order.setOrderToPaid)
}
