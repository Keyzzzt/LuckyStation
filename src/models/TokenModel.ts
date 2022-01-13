import { Schema, model, Document } from 'mongoose'
import { UserDocType } from './user.model'

export interface TokenDocType extends Document {
  user: UserDocType['id']
  refreshToken: string
}

const TokenSchema = new Schema<TokenDocType>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const TokenModel = model<TokenDocType>('Token', TokenSchema)
