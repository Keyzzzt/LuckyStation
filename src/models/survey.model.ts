import { Schema, model, Document, SchemaDefinitionProperty } from 'mongoose'
import { UserDocType } from './user.model'

export interface SurveyDocType extends Document {
  user: UserDocType['id']
  title: string
  body: string
  subject: string
  recipients: string[]
  yes: number
  no: number
  dateSent: SchemaDefinitionProperty<Schema.Types.Date>
  lastResponded: SchemaDefinitionProperty<Schema.Types.Date>
}
export interface RecipientDoc extends Document {
  email: string
  responded: boolean
  response: string
}

// SubDocument collection
const RecipientSchema: Schema = new Schema<RecipientDoc>({
  email: String,
  responded: { type: Boolean, default: false },
  response: String,
})

const SurveySchema: Schema = new Schema<SurveyDocType>(
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

export const SurveyModel = model<SurveyDocType>('Survey', SurveySchema)
