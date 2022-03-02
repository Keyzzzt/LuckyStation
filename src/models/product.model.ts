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
type Images = {
  imageSrc: string
  imageAlt: string
}

export interface ProductDocType extends Document {
  user: UserDocType['id']
  brand: string
  name: string
  images: Images[]
  category: string
  description: string
  description2: string
  includes: string
  maximumLoadCapacity: string
  weight: string
  size: string
  colors: string[]
  colorsInText: string
  materials: string
  careInstructions: string
  additionalInfo: string
  whatShouldYouKnow: string
  quality: string
  rating: number
  reviews: ReviewType[]
  numReviews: number
  price: number
  countInStock: number
  countInFavorite: number
  countViewed: number
  isNewProduct: boolean
  isDirty: boolean
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
    images: {
      type: [
        {
          imageSrc: String,
          imageAlt: String,
        },
      ],
      default: null,
    },
    category: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    description2: {
      type: String,
      default: '',
    },
    includes: { type: String, default: '' },
    maximumLoadCapacity: String,
    weight: String,
    size: String,
    colors: [String],
    colorsInText: String,
    materials: String,
    careInstructions: String,
    additionalInfo: String,
    whatShouldYouKnow: String,
    quality: String,
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
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isDirty: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const ProductModel = model<ProductDocType>('Product', ProductSchema)
