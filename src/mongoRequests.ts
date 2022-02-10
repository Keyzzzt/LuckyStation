/* eslint-disable no-underscore-dangle */
import { UserModel } from './models/user.model'

export async function getUserProfile(userId: string) {
  const profile = await UserModel.findById(userId).select(
    '-password -__v -activationLink -googleId -passwordResetToken -activationToken'
  )
  return {
    _id: profile._id,
    name: profile.name,
    email: profile.email,
    logo: profile.logo,
    phone: profile.phone,
    isAdmin: profile.isAdmin,
    isSubscribed: profile.isSubscribed,
    isActivated: profile.isActivated,
    favorite: profile.favorite,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  }
}
