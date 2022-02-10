/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { Schema, model, Document } from 'mongoose'

export interface UserDocType extends Document {
  name: string
  email: string
  password: string
  googleId: string
  phone: string
  logo: string
  isAdmin: boolean
  isSubscribed: boolean
  isActivated: boolean
  favorite: string[]
  activationToken: string
  passwordResetToken: string
  createdAt?: Date
  updatedAt?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema<UserDocType>(
  {
    email: { type: String, required: [true, 'Email is required.'], unique: true },
    name: { type: String, default: '' },
    password: { type: String, default: '' },
    phone: { type: String, default: '' },
    googleId: { type: String, default: '' },
    logo: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: false },
    favorite: [String],
    activationToken: { type: String },
    passwordResetToken: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

UserSchema.pre('save', async function (next: NextFunction) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)

  return next()
})

export const UserModel = model<UserDocType>('User', UserSchema)
