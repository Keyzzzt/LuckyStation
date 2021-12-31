import { Schema, model, Document } from 'mongoose'
import { UserDoc } from './user.model'

export interface TokenDoc extends Document {
  user: UserDoc['id']
  refreshToken: string
}

const TokenSchema = new Schema<TokenDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

export const TokenModel = model<TokenDoc>('Token', TokenSchema)
