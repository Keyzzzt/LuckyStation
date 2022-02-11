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
      page: 'as request parameter /admin/survey/:page/:limit',
      limit: 'as request parameter /admin/survey/:page/:limit',
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
      page: 'as request parameter /admin/survey/:page/:limit',
      limit: 'as request parameter /admin/survey/:page/:limit',
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
  'Get all products',
  {
    action: 'Get all products',
    method: 'GET',
    path: '/api/product/:page/:limit',
    access: 'public',
    requiredValues: {
      page: 'as request parameter /admin/survey/:page/:limit',
      limit: 'as request parameter /admin/survey/:page/:limit',
      keyword: 'as optional query parameter /admin/survey/:page/:limit',
    },
    successResponse: {
      data: [
        {
          _id: 'string',
          user: 'string',
          name: 'string',
          brand: 'string',
          image: 'string',
          category: 'string',
          description: 'string',
          rating: 'number',
          numReviews: 'number',
          price: 'number',
          countInStock: 'number',
          countInFavorite: 'number',
          countViewed: 'number',
          isDirty: 'boolean',
          isNewProduct: 'boolean',
          reviews: [
            {
              user: 'string',
              comment: 'string',
              rating: 'number',
            },
          ],
        },
      ],
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
      status: '404 - not found, 401 - not authorized, 500 - other error',
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
    comment: 'returns an array of products',
  },
  'Get all surveys by admin',
  {
    action: 'Get all surveys by admin',
    method: 'GET',
    path: '/admin/survey/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as request parameter',
      limit: 'as request parameter',
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
  'Create new order',
  {
    action: 'Create new order',
    method: 'POST',
    path: '/api/order',
    access: 'public',
    requiredValues: {
      taxPrice: 'number',
      shippingPrice: 'number',
      totalPrice: 'number',
      itemsPrice: 'number',
      paymentMethod: 'string',
      user: 'string',
      orderItems: [
        {
          product: {
            _id: 'string',
          },
          name: 'string',
          quantity: 'number',
          image: 'string',
          price: '100',
        },
      ],
      shippingAddress: {
        address: 'string',
        city: 'string',
        postalCode: 'string',
        country: 'string',
      },
    },
    successResponse: {
      data: 'created order id string',
      status: 201,
    },
    errorResponse: {
      status: '400; 401; 500',
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
  'Get own orders',
  {
    action: 'Get own orders',
    method: 'GET',
    path: '/api/order/myorders/:page/:limit',
    access: 'private',
    requiredValues: {
      page: 'as query parameter /admin/survey/:page/:limit',
      limit: 'as query parameter /admin/survey/:page/:limit',
    },
    successResponse: {
      data: {
        items: [
          {
            _id: 'string',
            user: 'string',
            paymentMethod: 'string',
            itemsPrice: 'number',
            taxPrice: 'number',
            shippingPrice: 'number',
            totalPrice: 'number',
            isDirty: 'boolean',
            isPaid: 'boolean',
            isDelivered: 'boolean',
            createdAt: 'date',
            updatedAt: 'date',
            paidAt: 'date',
            shippingAddress: {
              address: 'string',
              city: 'string',
              postalCode: 'string',
              country: 'string',
            },
            paymentResult: {
              id: '',
              status: '',
              updateTime: '',
              emailAddress: '',
            },
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
          },
        ],
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
      status: '404 - not found, 401 - not authorized, 500 - other error',
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
  'Get order by id - ADMIN',
  {
    action: 'Get order by id',
    method: 'GET',
    path: '/api/order/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter',
    },
    successResponse: {
      data: {
        _id: 'string',
        user: 'string',
        paymentMethod: 'string',
        itemsPrice: 'number',
        taxPrice: 'number',
        shippingPrice: 'number',
        totalPrice: 'number',
        isDirty: 'boolean',
        isPaid: 'boolean',
        isDelivered: 'boolean',
        createdAt: 'date',
        updatedAt: 'date',
        paidAt: 'date',
        shippingAddress: {
          address: 'string',
          city: 'string',
          postalCode: 'string',
          country: 'string',
        },
        paymentResult: {
          id: '',
          status: '',
          updateTime: '',
          emailAddress: '',
        },
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
      status: '404 - not found, 401 - not authorized, 500 - other error',
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

  'Set order to paid manually by admin',
  {
    action: 'Set order to paid manually by admin',
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
  'Set order to NOT paid manually by admin',
  {
    action: 'Set order to NOT paid manually by admin',
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
  'Set order to delivered manually by admin',
  {
    action: 'Set order to delivered manually by admin',
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
  'Set order to NOT delivered manually by admin',
  {
    action: 'Set order to NOT delivered manually by admin',
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
  'Get survey by id',
  {
    action: 'Get survey by id',
    method: 'GET',
    path: '/api/admin/survey/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter',
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
        isDirty: 'boolean',
        dateSent: 'date',
      },
      status: 200,
    },
    errorResponse: {
      status: '401; 404; 500',
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
  'Delete survey',
  {
    action: 'Delete survey',
    method: 'DELETE',
    path: '/api/admin/survey/:id',
    access: 'admin',
    requiredValues: {
      id: 'as query parameter',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '401; 404; 500',
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
  'Create survey',
  {
    action: 'Create survey',
    method: 'POST',
    path: '/api/admin/survey',
    access: 'admin',
    requiredValues: {
      title: 'string',
      subject: 'string',
      body: 'string',
      recipients: 'array of valid emails',
    },
    successResponse: {
      data: null,
      status: 201,
    },
    errorResponse: {
      status: '400; 401; 500',
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
  'Get own profile by user',
  {
    action: 'Get own profile by user',
    method: 'GET',
    path: '/api/user/profile',
    access: 'private',
    requiredValues: null,
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
      status: '401; 404; 500',
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
  'Update own profile by user',
  {
    action: 'Update own profile by user',
    method: 'PUT',
    path: '/api/user/profile',
    access: 'private',
    requiredValues: {
      oldPassword: 'string',
      newPassword: 'string',
      confirmNewPassword: 'string',
    },
    successResponse: {
      data: {
        accessToken: 'string',
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
      status: '401; 404; 500',
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
  'Add to favorites',
  {
    action: 'Add to favorites',
    method: 'POST',
    path: '/api/user/favorite/:id',
    access: 'private',
    requiredValues: {
      id: 'product id as query parameter',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '400; 401; 404; 500',
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
  'Remove from favorites',
  {
    action: 'Remove from favorites',
    method: 'DELETE',
    path: '/api/user/favorite/:id',
    access: 'private',
    requiredValues: {
      id: 'product id as query parameter',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '400; 401; 404; 500',
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
  'Subscribe and add to allSubscribersEmailList and allUsersEmailList',
  {
    action: 'Subscribe and add to allSubscribersEmailList and allUsersEmailList',
    method: 'GET',
    path: '/api/subscribe',
    access: 'public',
    requiredValues: {
      email: 'valid email',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '400; 401; 500',
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
      'Unsubscribe link should be in survey emails and in profile. This option will remove only from allSubscribersEmailList. To remove from allUsersEmailList use specific method.',
  },
  'Unsubscribe and remove from allSubscribersEmailList',
  {
    action: 'Unsubscribe and remove from allSubscribersEmailList',
    method: 'GET',
    path: '/api/survey/unsubscribe/:email',
    access: 'public',
    requiredValues: {
      email: 'as query parameter',
    },
    successResponse: {
      data: null,
      status: 201,
    },
    errorResponse: {
      status: '400; 401; 500',
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
      'Unsubscribe link should be in survey emails and in profile. This option will remove only from allSubscribersEmailList. To remove from allUsersEmailList use specific method.',
  },
  'Unsubscribe and remove from allSubscribersEmailList with link from survey',
  {
    action: 'Unsubscribe and remove from allSubscribersEmailList with link from survey',
    method: 'GET',
    path: '/api/survey/unsubscribe/:email',
    access: 'public',
    requiredValues: {
      email: 'as query parameter',
    },
    successResponse: {
      data: null,
      status: 201,
    },
    errorResponse: {
      status: '400; 401; 500',
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
      'Unsubscribe link should be in survey emails and in profile. This option will remove only from allSubscribersEmailList. To remove from allUsersEmailList use specific method.',
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
