import { Schema, model, Document } from 'mongoose'
import { UserDocument } from './user.model'

export interface Survey extends Document {
  user: UserDocument['id']
  title: string
  body: string
  subject: string
  recipients: string[]
  yes: number
  no: number
  dateSent: Date
  lastResponded: Date
}
export interface Recipient extends Document {
  email: string
  responded: boolean
}

// SubDocument collection
const RecipientSchema: Schema = new Schema<Recipient>({
  email: String,
  responded: { type: Boolean, default: false },
})

const SurveySchema: Schema = new Schema<Survey>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    title: { type: String, required: true },
    body: { type: String, required: true },
    subject: { type: String, required: true },
    recipients: [RecipientSchema],
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    dateSent: Date,
    lastResponded: Date,
  },
  {
    timestamps: true,
  }
)

export const SurveyModel = model<Survey>('Survey', SurveySchema)
