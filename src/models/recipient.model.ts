import { Schema, Document } from 'mongoose'

export interface Recipient extends Document {
  email: string
  responded: boolean
}

export const RecipientSchema: Schema = new Schema<Recipient>({
  email: String,
  responded: { type: Boolean, default: false },
})
