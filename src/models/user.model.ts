/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  logo: string
  isAdmin: boolean
  isSubscribed: boolean
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    logo: String,
    isAdmin: { type: Boolean, required: true, default: false },
    isSubscribed: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password) // TODO Проверить без await-
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  return next()
})

// Virtual method example
UserSchema.virtual('nameAndEmail').get(function (this: UserDocument) {
  return `${this.name} ${this.email}`
})

export const UserModel = model<UserDocument>('User', UserSchema)
