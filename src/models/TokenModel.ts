import { Schema, model, Document } from 'mongoose'
import { UserDocument } from './user.model'

export interface TokenDocument extends Document {
  user: UserDocument['id']
  refreshToken: string
}

const TokenSchema = new Schema<TokenDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const TokenModel = model<TokenDocument>('Token', TokenSchema)
