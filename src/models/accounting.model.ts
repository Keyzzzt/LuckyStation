import { Schema, model, Document } from 'mongoose'

export interface AccountingDoc extends Document {
  totalSold: number
}

const AccountingSchema: Schema = new Schema<AccountingDoc>(
  {
    totalSold: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)
export const AccountingModel = model<AccountingDoc>('Accounting', AccountingSchema)
