import { Schema, model, Document } from 'mongoose'
import { UserDocType } from './user.model'

export interface ReviewDocType extends Document {
  user: UserDocType['id']
  comment: string
  rating: number
}

export type ReviewType = {
  user: string
  comment: string
  rating: number
}

export interface ProductDocType extends Document {
  user: UserDocType['id']
  name: string
  image: string
  brand: string
  category: string
  description: string
  rating: number
  reviews: ReviewType[]
  colors: string[]
  sizes: number[]
  isNewProduct: boolean
  numReviews: number
  price: number
  countInStock: number
  countInFavorite: number
  countViewed: number
}
const ReviewSchema = new Schema<ReviewDocType>(
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

const ProductSchema = new Schema<ProductDocType>(
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
    brand: {
      type: String,
      required: true,
    },
    colors: [String],
    sizes: [Number],
    isNewProduct: Boolean,
    image: {
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

export const ProductModel = model<ProductDocType>('Product', ProductSchema)
