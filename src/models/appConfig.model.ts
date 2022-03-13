import { Schema, model, Document } from 'mongoose'

export interface AppConfigDocType extends Document {
  name: string
  adminColorTheme: string
  customersColorTheme: string
  darkThemeColors: string
  lightThemeColors: string
  defaultLanguage: string
  minPriceForFreeShipping: number
  defaultShippingPriceToNonEUCountries: number
  freeShippingMessage: string
  taxRate: number
}

const AppConfigSchema: Schema = new Schema<AppConfigDocType>(
  {
    name: { type: String, default: 'Config' },
    adminColorTheme: { type: String, default: 'light' },
    customersColorTheme: { type: String, default: 'light' },
    darkThemeColors: { type: String, default: '' },
    lightThemeColors: { type: String, default: '' },
    defaultLanguage: { type: String, default: 'en' },
    minPriceForFreeShipping: { type: Number, default: 1000 },
    defaultShippingPriceToNonEUCountries: { type: Number, default: 100 },
    freeShippingMessage: { type: String, default: 'You are eligible for free shipping in EU' },
    taxRate: { type: Number, default: 0.2 },
  },
  {
    timestamps: true,
  }
)
export const AppConfigModel = model<AppConfigDocType>('config', AppConfigSchema)
