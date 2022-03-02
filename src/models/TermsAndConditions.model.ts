import { Schema, model, Document } from 'mongoose'
import { UserDocType } from './user.model'

export interface TermsAndConditionsDocType extends Document {
  user: UserDocType['id']
  lang: string
  mainTitle: string
  companyAddress: {
    companyName: string
    companyId: string
    companyAddress: string
    companyPhone: string
    companyEmail: string
  }
  termsAndConditions: [
    {
      paragraphTitle: string
      paragraphText: string
    }
  ]
}

const TermsAndConditionsSchema = new Schema<TermsAndConditionsDocType>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel' },
    lang: { type: String, required: true },
    mainTitle: { type: String, required: true },
    companyAddress: {
      companyName: { type: String, required: true },
      companyId: { type: String, required: true },
      companyAddress: { type: String, required: true },
      companyPhone: { type: String, required: true },
      companyEmail: { type: String, required: true },
    },
    termsAndConditions: [
      {
        paragraphTitle: { type: String, required: true },
        paragraphText: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const TermsAndConditionsModel = model<TermsAndConditionsDocType>(
  'Terms and Conditions',
  TermsAndConditionsSchema
)
