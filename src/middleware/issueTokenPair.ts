/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { UserModel } from '@src/models/user.model'

// TODO remove this
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

export function signJWT(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { payload: decoded, expired: false }
  } catch (error) {
    return { payload: null, expired: error.message.includes('jwt expired') }
  }
}
