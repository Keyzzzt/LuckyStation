import { Schema, model, Document } from 'mongoose'

export interface AccountingDocType extends Document {
  totalSold: number
}

const AccountingSchema: Schema = new Schema<AccountingDocType>(
  {
    totalSold: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

export const AccountingModel = model<AccountingDocType>('Accounting', AccountingSchema)
