/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { NextFunction, Request, Response } from 'express'

const apiDocumentation = [
  '***** PUBLIC',
  'Issues new pair of access and refresh token',
  {
    action: 'Issues new pair of access and refresh token',
    method: 'GET',
    path: '/api/refresh',
    access: 'public',
    requiredValues: {
      refreshToken: 'refreshToken in cookies',
    },
    successResponse: {
      data: {
        accessToken: 'new accessToken as string',
        _id: 'users _id as string',
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
  'Get all products',
  {
    action: 'Get all products',
    method: 'GET',
    path: '/api/product/:page/:limit',
    access: 'public',
    requiredValues: {
      page: 'as route parameter',
      limit: 'as route parameter',
      keyword: 'as optional query parameter',
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
  'Get single product by id',
  {
    action: 'Get single product by id',
    method: 'GET',
    path: '/api/product/:id',
    access: 'public',
    requiredValues: {
      id: 'product id as route parameter',
    },
    successResponse: {
      data: {
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
        isNewProduct: 'boolean',
        isDirty: 'boolean',
        reviews: [
          {
            rating: 'number',
            comment: 'string',
            user: 'string',
            _id: 'string',
            createdAt: 'date',
            updatedAt: 'date',
          },
        ],
        createdAt: 'date',
        updatedAt: 'date',
      },
      status: 200,
    },
    errorResponse: {
      status: '404 - not found, 500 - other error',
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
  'Add to favorites',
  {
    action: 'Add to favorites',
    method: 'POST',
    path: '/api/user/favorite/:id',
    access: 'public',
    requiredValues: {
      id: 'product id as route parameter',
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
    access: 'public',
    requiredValues: {
      id: 'product id as route parameter',
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
    method: 'DELETE',
    path: '/api/subscribe',
    access: 'public',
    requiredValues: {
      email: 'valid email',
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
  'Get PAYPAL client id',
  {
    action: 'Get PAYPAL client id',
    method: 'GET',
    path: '/api/config/paypal',
    access: 'public',
    requiredValues: null,
    successResponse: {
      data: 'string',
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
  'Login',
  {
    action: 'Login',
    method: 'POST',
    path: '/api/login',
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
    path: '/api/registration',
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
    path: '/api/logout',
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
    path: '/api/auth/google/redirect',
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
    path: '/api/auth/google',
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
  'Activate account after registration',
  {
    action: 'Activate account after registration',
    method: 'GET',
    path: '/api/activate/:token',
    access: 'public',
    requiredValues: {
      token: 'token from link that has been sent to users email as route parameter',
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
  'Send a link to recover a password',
  {
    action: 'Send a link to recover a password',
    method: 'POST',
    path: '/api/recovery',
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
    path: '/api/recovery',
    access: 'public',
    requiredValues: {
      password: 'string',
      confirm: 'string',
      passwordResetToken: 'token that has been sent to users email',
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

  '****ADMIN',
  'Get all users by admin',
  {
    action: 'Get all users by admin',
    method: 'GET',
    path: '/api/admin/user/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as route parameter',
      limit: 'as route parameter',
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
    path: '/api/admin/user/:id',
    access: 'admin',
    requiredValues: {
      id: 'user id as route parameter',
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
  'Get user by admin',
  {
    action: 'Get user by id',
    method: 'GET',
    path: '/api/admin/user/:id',
    access: 'admin',
    requiredValues: {
      id: 'user id as route parameter',
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
    path: '/api/admin/user/:id',
    access: 'admin',
    requiredValues: {
      id: 'user id as route parameter',
    },
    successResponse: {
      data: null,
      status: 200,
    },
    errorResponse: {
      status: '404 - user not found, 401 - not admin, 500 - server error',
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
    path: '/api/admin/order/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as route parameter',
      limit: 'as route parameter',
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
        isPaid: 'boolean',
        isDelivered: 'boolean',
        shippingAddress: {
          address: 'string',
          city: 'string',
          postalCode: 'number',
          country: 'string',
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
    path: '/api/admin/survey/:page/:limit',
    access: 'admin',
    requiredValues: {
      page: 'as route parameter',
      limit: 'as route parameter',
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

  'Get order by admin',
  {
    action: 'Get order by admin',
    method: 'GET',
    path: '/api/order/:id',
    access: 'admin',
    requiredValues: {
      id: 'as route parameter',
    },
    successResponse: {
      data: {
        _id: 'order id',
        user: 'user id that has created order',
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
    path: '/api/admin/order/:id/pay',
    access: 'admin',
    requiredValues: {
      id: 'order id as route parameter',
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
    path: '/api/admin/order/:id/pay',
    access: 'admin',
    requiredValues: {
      id: 'order id as route parameter',
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
    path: '/api/admin/order/:id/delivered',
    access: 'admin',
    requiredValues: {
      id: 'order id as route parameter',
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
    path: '/api/admin/order/:id/delivered',
    access: 'admin',
    requiredValues: {
      id: 'order id as route parameter',
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
    path: '/api/admin/product',
    access: 'admin',
    requiredValues: {
      name: 'string',
      price: 'string',
      image: 'string',
      brand: 'string',
      category: 'string',
      countInStock: 'number',
      description: 'string',
      description2: 'string',
      includes: 'string',
      maximumLoadCapacity: 'string',
      weight: 'string',
      size: 'string',
      colors: 'array of string',
      colorsInText: 'string',
      materials: 'string',
      careInstructions: 'string',
      additionalInfo: 'string',
      whatShouldYouKnow: 'string',
      quality: 'string',
      isNewProduct: 'boolean',
    },
    successResponse: {
      data: {
        user: 'user id',
        name: 'string',
        brand: 'string',
        images: 'array of objects with imageSrc & imageAlt string fields ',
        category: 'string',
        description: 'string',
        description2: 'string',
        includes: 'string',
        maximumLoadCapacity: 'string',
        weight: 'string',
        size: 'string',
        colors: 'array of string',
        colorsInText: 'string',
        materials: 'string',
        careInstructions: 'string',
        additionalInfo: 'string',
        whatShouldYouKnow: 'string',
        quality: 'string',
        rating: 'number',
        numReviews: 'number',
        price: 'number',
        countInStock: 'number',
        countInFavorite: 'number',
        countViewed: 'number',
        isNewProduct: 'boolean',
        isDirty: 'boolean',
        _id: 'string',
        reviews: [],
        createdAt: 'Date',
        updatedAt: 'Date',
        __v: 'number',
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
  'Update product',
  {
    action: 'Update product',
    method: 'PUT',
    path: '/api/admin/product/:id',
    access: 'admin',
    requiredValues: {
      id: 'as route parameter',
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
    path: '/api/admin/product/:id',
    access: 'admin',
    requiredValues: {
      id: 'as route parameter',
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
    path: '/api/admin/statistic',
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
    path: '/api/admin/statistic/email',
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
      id: 'as route parameter',
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
      id: 'as route parameter',
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

  '***** PRIVATE',

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
  'Get own orders by user',
  {
    action: 'Get own orders by user',
    method: 'GET',
    path: '/api/order/myorders/:page/:limit',
    access: 'private',
    requiredValues: {
      page: 'as query parameter',
      limit: 'as query parameter',
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
  'Set order to paid automatically after payment',
  {
    action: 'Set order to paid after payment',
    method: 'POST',
    path: '/api/order/:orderId/pay',
    access: 'private',
    requiredValues: {
      orderId: 'order id as route parameter',
      id: 'comes from paypal',
      status: 'comes from paypal',
      update_time: 'string',
      payer: {
        email_address: 'email that customer used to pay with paypal',
      },
    },
    successResponse: {
      data: {},
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
  'Create product review',
  {
    action: 'Create product review',
    method: 'POST',
    path: '/api/product/:id/review',
    access: 'private',
    requiredValues: {
      id: 'product id as route parameter',
      rating: 'number',
      comment: 'string',
    },
    successResponse: {
      data: null,
      status: 201,
    },
    errorResponse: {
      status: '400 - bad request, 401 - not authorized, 500 - other error',
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

export async function getApiInfo(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json(apiDocumentation)
  } catch (error) {
    return next(error.message)
  }
}
