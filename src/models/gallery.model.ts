import { Schema, model, Document } from 'mongoose'
import { UserDocType } from './user.model'

export interface GalleryDocType extends Document {
  user: UserDocType['id']
  title: string
  src: {
    small: string
    large: string
  }
  description: string
  className: 'h_stretch' | 'v_stretch' | 'big' | 'small'
}

const GallerySchema = new Schema<GalleryDocType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    src: {
      small: {
        type: String,
        required: true,
      },
      large: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: 'small',
    },
  },
  {
    timestamps: true,
  }
)

export const GalleryModel = model<GalleryDocType>('Gallery', GallerySchema)
