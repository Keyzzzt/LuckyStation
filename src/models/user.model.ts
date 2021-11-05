/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

interface User {
  name: string
  email: string
  password: string
  isAdmin: boolean
  isSubscribed: boolean
  refreshToken?: string
  accessToken?: string
}
export interface UserDocument extends User, Document {
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSubscribed: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshToken: String,
    accessToken: String,
  },
  {
    timestamps: true,
  }
)
// Compare a candidate password with user's password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

// When user registers
UserSchema.pre('save', async function (this: UserDocument, next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Virtual method
UserSchema.virtual('nameAndEmail').get(function (this: UserDocument) {
  return `${this.name} ${this.email}`
})

export const UserModel = model<UserDocument>('User', UserSchema)
