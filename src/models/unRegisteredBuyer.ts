import { Schema, model, Document } from 'mongoose'

export interface unRegisteredBuyerDocType extends Document {
  email: string
  phone: string
  googleId: string
  isSubscribed: boolean
  createdAt?: Date
  updatedAt?: Date
}

const unRegisteredBuyerSchema: Schema = new Schema<unRegisteredBuyerDocType>(
  {
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    googleId: { type: String, default: '' },
    isSubscribed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

export const unRegisteredBuyerModel = model<unRegisteredBuyerDocType>('UnRegisteredBuyer', unRegisteredBuyerSchema)
