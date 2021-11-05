import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { UserModel } from '@src/models/user.model'

export async function issueTokenPair(userId) {
  const newRefreshToken = uuidv4()
  const doc = await UserModel.findById({ _id: userId })
  if (!doc) {
    throw new Error('No user found')
  }
  doc.refreshToken = newRefreshToken
  await doc.save()

  return {
    accessToken: jwt.sign({ id: doc._id }, process.env.JWT_TOKEN, { expiresIn: '100m' }),
    refreshToken: newRefreshToken,
  }
}
