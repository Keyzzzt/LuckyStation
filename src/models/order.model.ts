import { Schema, model, Document } from 'mongoose'
import { ProductDoc } from './product.model'
import { UserDoc } from './user.model'

interface ShippingAddress {
  address: string
  city: string
  postalCode: string
  country: string
}
interface PaymentResult {
  id: string
  status: string
  updateTime: string
  emailAddress: string
}
export interface OrderItemDoc extends Document {
  name: string
  quantity: number
  image: string
  price: number
  product: ProductDoc['id']
}
export interface OrderDoc extends Document {
  user: UserDoc['id'] | string // Если незарегистрированный пользователь, пишем сюда имя.
  orderItems: OrderItemDoc[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentResult: PaymentResult
  itemsPrice: number
  taxPrice: number
  shippingPrice: number
  totalPrice: number
  isPaid: boolean
  paidAt: Date | number
  isDelivered: boolean
  deliveredAt: Date | number
}

const OrderSchema = new Schema<OrderDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      updateTime: { type: String },
      emailAddress: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const OrderModel = model<OrderDoc>('Order', OrderSchema)
