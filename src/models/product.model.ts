import { Schema, model, Document } from 'mongoose'
import { UserDoc } from './user.model'

export interface ReviewDoc extends Document {
  user: UserDoc['id']
  comment: string
  rating: number
}

export type ReviewType = {
  user: string
  comment: string
  rating: number
}

export interface ProductDoc extends Document {
  user: UserDoc['id']
  name: string
  image: string
  brand: string
  category: string
  description: string
  rating: number
  reviews: ReviewType[]
  numReviews: number
  price: number
  countInStock: number
  countInFavorite: number
  countViewed: number
}
const ReviewSchema = new Schema<ReviewDoc>(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const ProductSchema = new Schema<ProductDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviews: [ReviewSchema],
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    countInFavorite: {
      type: Number,
      default: 0,
    },
    countViewed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export const ProductModel = model<ProductDoc>('Product', ProductSchema)
