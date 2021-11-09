import { Schema, model, Document } from 'mongoose'
import { UserDocument } from './user.model'

export interface SessionDocument extends Document {
  user: UserDocument['id']
  valid: boolean
  userAgent: string
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<SessionDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    valid: { type: Boolean, default: true },
    userAgent: String, // browser information
  },
  {
    timestamps: true,
  }
)

export const SessionModel = model<SessionDocument>('Session', SessionSchema)
