// import { JSONSchemaType } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

const login: any = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', nullable: true, minLength: 3 },
  },
  required: ['email', 'password'],
  additionalProperties: false,
}
const reg: any = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 15 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 3, maxLength: 15 },
  },
  required: ['email', 'password', 'name'],
  additionalProperties: false,
}
const updateProfileByUserOrAdmin: any = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 3, maxLength: 15 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', nullable: true, minLength: 3 },
    isAdmin: { type: 'boolean' },
  },
  required: [],
  additionalProperties: false,
}
const createAndUpdateProduct: any = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    price: { type: 'number' },
    image: { type: 'string' },
    brand: { type: 'string' },
    category: { type: 'string' },
    countInStock: { type: 'number' },
    description: { type: 'string' },
  },
  required: ['name', 'price', 'image', 'brand', 'category', 'countInStock', 'description'],
  additionalProperties: false,
}

const createNewOrder: any = {
  type: 'object',
  properties: {
    orderItems: { type: 'array' }, // TODO Уточнить
    shippingAddress: { type: 'object' }, // TODO Уточнить
    paymentMethod: { type: 'string' }, // TODO Уточнить
    itemsPrice: { type: 'number' },
    taxPrice: { type: 'number' },
    shippingPrice: { type: 'number' },
    totalPrice: { type: 'number' },
  },
  required: ['orderItems', 'shippingAddress', 'paymentMethod', 'itemsPrice', 'taxPrice', 'shippingPrice', 'totalPrice'],
  additionalProperties: false,
}
const createReview: any = {
  type: 'object',
  properties: {
    rating: { type: 'number' },
    comment: { type: 'string' },
  },
  required: ['rating', 'comment'],
  additionalProperties: false,
}

export const loginV = ajv.compile(login)
export const regV = ajv.compile(reg)
export const updateProfileByUserOrAdminV = ajv.compile(updateProfileByUserOrAdmin)
export const createAndUpdateProductV = ajv.compile(createAndUpdateProduct)
export const createNewOrderV = ajv.compile(createNewOrder)
export const createReviewV = ajv.compile(createReview)

export const validateDTO = (compiledSchema) => {
  return (req, res, next) => {
    const valid = compiledSchema(req.body)
    if (!valid) {
      const { errors } = compiledSchema
      res.status(400).json({
        resultCode: 0,
        message: [errors.map((e) => e.message)],
        data: null,
      })
    }
    return next()
  }
}

// orderItems: [
//   {
//     name: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'Product',
//     },
//   },
// ],
// shippingAddress: {
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   postalCode: { type: String, required: true },
//   country: { type: String, required: true },
// },
// paymentMethod: {
//   type: String,
//   required: true,
// },
// paymentResult: {
//   id: { type: String },
//   status: { type: String },
//   updateTime: { type: String },
//   emailAddress: { type: String },
// },
