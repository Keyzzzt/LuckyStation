/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'

const routes = [
  'Login',
  {
    action: 'Login',
    method: 'POST',
    path: '/login',
    access: 'public',
    requiredValues: {
      email: 'string',
      password: 'string',
    },
    successResponse: {
      data: {
        accessToken: 'string',
        _id: 'string',
      },
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'Required valid email and password between 3 and 33 characters in body',
  },
  'Registration',
  {
    action: 'Registration',
    method: 'POST',
    path: '/registration',
    access: 'public',
    requiredValues: {
      email: 'string',
      password: 'string',
    },
    successResponse: {
      data: null,
      status: 201,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'Required valid email and password between 3 and 33 characters in body',
  },
  'Logout',
  {
    action: 'Logout',
    method: 'POST',
    path: '/logout',
    access: 'public',
    requiredValues: null,
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Google OAUTH redirect',
  {
    action: 'Redirect to Google authentication',
    method: 'GET',
    path: '/auth/google/redirect',
    access: 'public',
    requiredValues: null,
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Google OAUTH',
  {
    action: 'Login / Register with google',
    method: 'GET',
    path: '/auth/google',
    access: 'public',
    requiredValues: null,
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'If success redirects to main page',
  },
  'Account activation',
  {
    action: 'Activate account after registration',
    method: 'GET',
    path: '/activate/:token',
    access: 'public',
    requiredValues: {
      token: 'token from link that has been sent to users email as query parameter string /activate/:token',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'If success redirects to main page',
  },
  'Password reset link to email',
  {
    action: 'Send a link to recover a password',
    method: 'POST',
    path: '/recovery',
    access: 'public',
    requiredValues: {
      email: 'string',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Set new password',
  {
    action: 'Set new password',
    method: 'PUT',
    path: '/recovery',
    access: 'public',
    requiredValues: {
      password: 'string',
      confirm: 'string',
      passwordResetToken: 'string',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Issues new pair of access and refresh token',
  {
    action: 'Issues new pair of access and refresh token',
    method: 'GET',
    path: '/refresh',
    access: 'public',
    requiredValues: {
      refreshToken: 'valid refreshToken in cookies',
    },
    successResponse: {
      data: {
        accessToken: 'string',
        _id: 'string',
      },
      status: 200,
    },
    errorResponse: {
      status: 400,
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Get all users by admin',
  {
    action: 'Get all users by admin',
    method: 'GET',
    path: '/admin/user/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as query parameter /admin/user/:page/:limit',
      limit: 'as query parameter /admin/user/:page/:limit',
    },
    successResponse: {
      data: {
        _id: 'string',
        name: 'string',
        email: 'string',
        logo: 'string',
        phone: 'string',
        isAdmin: 'boolean',
        isSubscribed: 'boolean',
        isActivated: 'boolean',
        favorite: 'array',
        createdAt: 'date',
        updatedAt: 'date',
      },
      status: 200,
    },
    errorResponse: {
      status: '404 - users not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'Returns an array of users',
  },
  'Set user admin status',
  {
    action: 'Set user admin status',
    method: 'PUT',
    path: '/admin/user/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/user/:id',
      isAdmin: 'boolean',
    },
    successResponse: {
      data: {
        _id: 'string',
        email: 'string',
        name: 'string',
        phone: 'string',
        logo: 'string',
        isAdmin: 'boolean',
        isSubscribed: 'boolean',
        isActivated: 'boolean',
        favorite: 'Array of favorite products ids',
        createdAt: 'Date',
        updatedAt: 'Date',
      },
      status: 200,
    },
    errorResponse: {
      status: '404 - user not found, 401 - not admin, 500 - id not valid / server error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Get user by id',
  {
    action: 'Get user by id',
    method: 'GET',
    path: '/admin/user/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/user/:id',
    },
    successResponse: {
      data: {
        _id: 'string',
        email: 'string',
        name: 'string',
        phone: 'string',
        logo: 'string',
        isAdmin: 'boolean',
        isSubscribed: 'boolean',
        isActivated: 'boolean',
        favorite: 'Array of favorite products ids',
        createdAt: 'Date',
        updatedAt: 'Date',
      },
      status: 200,
    },
    errorResponse: {
      status: '404 - user not found, 401 - not admin, 500 - id not valid / server error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Delete user by admin',
  {
    action: 'Delete user by admin',
    method: 'DELETE',
    path: '/admin/user/:id',
    access: 'admin',
    requiredValues: {
      id: 'valid mongoDB _id /admin/user/:id',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '404 - user not found, 401 - not admin, 500 - id not valid / server error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Get all orders by admin',
  {
    action: 'Get all orders by admin',
    method: 'GET',
    path: '/admin/order/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as query parameter /admin/order/:page/:limit',
      limit: 'as query parameter /admin/order/:page/:limit',
    },
    successResponse: {
      data: {
        shippingAddress: {
          address: 'string',
          city: 'string',
          postalCode: 'number',
          country: 'string',
        },
        _id: 'string',
        user: 'string',
        orderItems: [
          {
            name: 'string',
            quantity: 'number',
            image: 'string',
            price: 'number',
            product: 'string',
            _id: 'string',
          },
        ],
        paymentMethod: 'string',
        itemsPrice: 'number',
        taxPrice: 'number',
        shippingPrice: 'number',
        totalPrice: 'number',
        isPaid: 'boolean',
        isDelivered: 'boolean',
      },
      totalPages: 'number',
      next: {
        page: 'number',
        limit: 'number',
      },
      prev: {
        page: 'number',
        limit: 'number',
      },
      status: 200,
    },
    errorResponse: {
      status: '404 - orders not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'Returns an array of order objects',
  },
  'Get all surveys by admin',
  {
    action: 'Get all surveys by admin',
    method: 'GET',
    path: '/admin/survey/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as query parameter /admin/survey/:page/:limit',
      limit: 'as query parameter /admin/survey/:page/:limit',
    },
    successResponse: {
      data: {
        _id: 'string',
        user: 'string',
        title: 'string',
        body: 'string',
        subject: 'string',
        yes: 'number',
        no: 'number',
        dateSent: 'Date',
        isDirty: false,
      },
      totalPages: 'number',
      next: {
        page: 'number',
        limit: 'number',
      },
      prev: {
        page: 'number',
        limit: 'number',
      },
      status: 200,
    },
    errorResponse: {
      status: '404 - surveys not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: 'Returns an array with survey objects',
  },
  'Set order to paid',
  {
    action: 'Set order to paid',
    method: 'POST',
    path: '/admin/order/:id/pay',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/order/:id/pay',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '404 - order not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Set order to NOT paid',
  {
    action: 'Set order to NOT paid',
    method: 'DELETE',
    path: '/admin/order/:id/pay',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/order/:id/pay',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '404 - order not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Set order to delivered',
  {
    action: 'Set order to delivered',
    method: 'POST',
    path: '/admin/order/:id/delivered',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/order/:id/delivered',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '404 - order not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Set order to NOT delivered',
  {
    action: 'Set order to NOT delivered',
    method: 'POST',
    path: '/admin/order/:id/delivered',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/order/:id/delivered',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '404 - order not found, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Create new product',
  {
    action: 'Create new product',
    method: 'POST',
    path: '/admin/product',
    access: 'admin',
    requiredValues: {
      name: 'string',
      price: 'string',
      image: 'string',
      brand: 'string',
      category: 'string',
      countInStock: 'number',
      description: 'string',
      isNewProduct: 'boolean',
    },
    successResponse: {
      data: null,
      status: 201,
    },
    errorResponse: {
      status: '400 - bad request, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Update product',
  {
    action: 'Update product',
    method: 'PUT',
    path: '/admin/product/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/product/:id',
      name: 'string',
      price: 'string',
      image: 'string',
      brand: 'string',
      category: 'string',
      countInStock: 'number',
      description: 'string',
      isNewProduct: 'boolean',
    },
    successResponse: {
      data: {
        name: 'string',
        price: 'string',
        image: 'string',
        brand: 'string',
        category: 'string',
        countInStock: 'number',
        description: 'string',
        isNewProduct: 'boolean',
      },
      status: 201,
    },
    errorResponse: {
      status: '400 - bad request, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Delete product',
  {
    action: 'Delete product',
    method: 'DELETE',
    path: '/admin/product/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter /admin/product/:id',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '400 - bad request, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
  'Get statistic',
  {
    action: 'Get statistic',
    method: 'GET',
    path: '/admin/statistic',
    access: 'admin',
    requiredValues: null,
    successResponse: {
      data: {
        totalUsers: 'number',
        totalSubscribed: 'number',
        totalUnSubscribed: 'number',
        totalOrders: 'number',
        totalProductsAllTime: 'number',
        totalProductsPresent: 'number',
        totalReviews: 'number',
        totalSurveys: 'number',
        totalYes: 'number',
        totalNo: 'number',
        allSearchQueries: 'array with search queries',
        allSubscribersEmailList: 'array with subscribers emails',
        allUsersEmailList: 'array with all users emails',
      },
      status: 200,
    },
    errorResponse: {
      status: '400 - bad request, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment:
      'allSubscribersEmailList - array that contain users that have subscribed for news; allUsersEmailList - array that contains all email that ever been registered on web site',
  },
  'Remove email from lists and unsubscribe',
  {
    action: 'Remove email from lists and unsubscribe',
    method: 'PUT',
    path: '/admin/statistic/email',
    access: 'admin',
    requiredValues: null,
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '400 - bad request, 401 - not admin, 500 - other error',
      error: 'Error message',
      errors: [
        {
          value: 'string',
          msg: 'string',
          param: 'string',
          location: 'string',
        },
      ],
    },
    comment: '',
  },
]

const models = [
  {
    modelName: '',
  },
]

export async function getApiInfo(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({
      routes,
      models,
    })
  } catch (error) {
    return next(error.message)
  }
}
