/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'

/**
 *? allUsersEmailList - список имейлов - зарегистрированных, зарегистрировавшихся но не активированных, купивших товар без регистрации, подписавшихся на рассылку без регистрации, подписавшихся но отписавшихся потом.
 *? allSubscribersEmailList - список имейлов подписавшихся (зарегистрированных и нет)
 */

export interface StatisticDocType extends Document {
  name: string
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
  allSubscribersEmailList: string[]
  allUsersEmailList: string[]
}

const StatisticSchema: Schema = new Schema<StatisticDocType>(
  {
    name: { type: String, default: 'Statistic' },
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
    allSubscribersEmailList: [String],
    allUsersEmailList: [String],
  },
  {
    timestamps: true,
  }
)
export const StatisticModel = model<StatisticDocType>('Statistic', StatisticSchema)
