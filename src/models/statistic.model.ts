/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'

export interface StatisticDoc extends Document {
  totalUsers: number
  totalSubscribed: number
  totalUnSubscribed: number
  totalOrders: number
  totalProductsAllTime: number
  totalProductsPresent: number
  totalReviews: number
  totalSurveys: number
  totalYes: number
  totalNo: number
  allSearchQueries: string[]
}

const StatisticSchema: Schema = new Schema<StatisticDoc>(
  {
    totalUsers: { type: Number, default: 0 },
    totalSubscribed: { type: Number, default: 0 },
    totalUnSubscribed: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalProductsAllTime: { type: Number, default: 0 },
    totalProductsPresent: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSurveys: { type: Number, default: 0 },
    totalYes: { type: Number, default: 0 },
    totalNo: { type: Number, default: 0 },
    allSearchQueries: [String],
  },
  {
    timestamps: true,
  }
)
export const StatisticModel = model<StatisticDoc>('Statistic', StatisticSchema)
