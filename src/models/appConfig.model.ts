import { Schema, model, Document } from 'mongoose'

export interface AppConfig extends Document {
  adminColorTheme: string
  customersColorTheme: string
  darkThemeColors: string
  lightThemeColors: string
  defaultLanguage: string
}

const AppConfigSchema: Schema = new Schema<AppConfig>(
  {
    adminColorTheme: { type: String, default: 'light' },
    customersColorTheme: { type: String, default: 'light' },
    darkThemeColors: { type: String, default: '' },
    lightThemeColors: { type: String, default: '' },
    defaultLanguage: { type: String, default: 'en' },
  },
  {
    timestamps: true,
  }
)
export const AppConfigModel = model<AppConfig>('AppConfig', AppConfigSchema)
