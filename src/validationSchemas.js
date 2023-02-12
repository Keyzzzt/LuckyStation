/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
import { body } from 'express-validator'

export const password_confirm = [
  body('password', 'Invalid email or password').trim().isLength({ min: 3, max: 33 }),
  body('confirm', 'Invalid email or password').trim().isLength({ min: 3, max: 33 }),
]

export const auth = [
  body('email', 'Invalid email or password').trim().isEmail().bail(),
  body('password', 'Invalid email or password').trim().isLength({ min: 3, max: 33 }),
]
export const emailOnly = [body('email', 'Invalid email').trim().isEmail()]

export const paypalPaymentResult = [
  body('id', 'id is required.').trim().isString(),
  body('status', 'status is required.').trim().isString(),
  body('update_time', 'update_time is required.').trim().isDate(),
]

export const updateProfileByUser = [
  // FIXME: Смены пароля может и не быть, но если newPassword / confirmNewPassword не пустые, то их нужно проверить.
  body('newPassword', 'Password should be between 3 and 33').trim().isLength({ min: 3, max: 33 }),
  body('confirmNewPassword', 'Password should be between 3 and 33').trim().isLength({ min: 3, max: 33 }),
]

export const updateProfileByAdmin = [body('isAdmin').isBoolean()]

export const createAndUpdateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ max: 32 })
    .withMessage('Product name must be between 1 and 32 characters long.'),
  body('price')
    .trim()
    .notEmpty()
    .withMessage('Price is required.')
    .isNumeric()
    .withMessage('Price must contain only numbers.'),
  body('image', 'Product image is required.').trim().notEmpty(),
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required.')
    .isLength({ max: 32 })
    .withMessage('Brand length is maximum 32 characters.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isLength({ max: 32 })
    .withMessage('Category length is maximum 32 characters.'),
  body('countInStock')
    .trim()
    .notEmpty()
    .withMessage('Price is required.')
    .isNumeric()
    .withMessage('Count must contain only numbers.'),
  body('description', 'Description is required.')
    .trim()
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Brand length is minimum 6 characters.'),
]

export const createSurvey = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Survey title is required')
    .isLength({ min: 3, max: 32 })
    .withMessage('Survey title must be between 3 and 32 characters long.'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Survey subject is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Survey subject must be between 3 and 100 characters long.'),
  body('body')
    .trim()
    .notEmpty()
    .withMessage('Survey body message is required')
    .isLength({ min: 3, max: 1000 })
    .withMessage('Survey body message must be between 3 and 1000 characters long.'),
  body('recipients', 'Recipients list is empty.').trim().notEmpty(),
]

// FIXME: How to validate object & array?
export const createOrder = [
  body('orderItems', 'No products in order.').isArray({ min: 1 }),
  body('shippingAddress').isObject(),
  body('paymentMethod').trim().notEmpty().withMessage('Order items is empty.'),
  body('itemsPrice')
    .trim()
    .notEmpty()
    .withMessage('Items price is required.')
    .bail()
    .isNumeric()
    .withMessage('Price must contain only numbers.'),
  body('taxPrice')
    .trim()
    .notEmpty()
    .withMessage('Tax price is required.')
    .bail()
    .isNumeric()
    .withMessage('Tax price must contain only numbers.'),
  body('shippingPrice')
    .trim()
    .notEmpty()
    .withMessage('Shipping price is required.')
    .bail()
    .isNumeric()
    .withMessage('Shipping price must contain only numbers.'),
  body('totalPrice')
    .trim()
    .notEmpty()
    .withMessage('Total price is required.')
    .bail()
    .isNumeric()
    .withMessage('Total price must contain only numbers.'),
]

export const createReview = [
  body('rating')
    .trim()
    .notEmpty()
    .withMessage('Button is required.')
    .bail()
    .isNumeric()
    .withMessage('Button must contain only numbers.'),
  body('comment').trim().notEmpty().withMessage('Comment is required.'),
]

// Some validators https://express-validator.github.io/docs/validation-chain-api.html#not
// Complete list of standard validators https://github.com/validatorjs/validator.js#validators
// Note: Since validator.js only accepts string as input, any value (including arrays and objects)
// that needs to be validated by a Standard Validator is first converted to such type.

// isMongoId(str) - check if the string is a valid hex-encoded representation of a MongoDB ObjectId.

// isStrongPassword(str [, options])

// isURL(str [, options])

// isUUID(str [, version])

// toInt()
