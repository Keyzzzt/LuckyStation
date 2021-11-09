/* eslint-disable no-underscore-dangle */
import jwt from 'jsonwebtoken'

export function signJWT(payload: object, expiresIn: string | number) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { payload: decoded, expired: false, valid: true }
  } catch (error) {
    return { payload: null, expired: error.message.includes('jwt expired'), valid: false }
  }
}
