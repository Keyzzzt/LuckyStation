import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { User } from '@src/Models/UserModel'

export async function issueTokenPair(userId: string) {
  const newRefreshToken: string = uuidv4()
  const doc = await User.findById({ _id: userId })
  if (!doc) {
    throw new Error('No user found')
  }
  doc.refreshToken = newRefreshToken
  await doc.save()

  return {
    token: jwt.sign({ id: doc._id }, process.env.JWT_TOKEN, { expiresIn: '30m' }),
    refreshToken: newRefreshToken,
  }
}
