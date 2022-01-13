/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import { Schema, model, Document } from 'mongoose'

export interface UserDocType extends Document {
  email: string
  password: string
  googleId: string
  logo: string
  isAdmin: boolean
  isSubscribed: boolean
  isActivated: boolean
  activationLink: string
  credits: number
  favorite: string[]
  createdAt?: Date
  updatedAt?: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema<UserDocType>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: '' },
    logo: { type: String, default: '' },
    isAdmin: { type: Boolean, required: true, default: false },
    isSubscribed: { type: Boolean, required: true, default: false },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    credits: { type: Number, default: 0 },
    favorite: [String],
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
