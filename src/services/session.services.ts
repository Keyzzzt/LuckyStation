/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { FilterQuery, UpdateQuery } from 'mongoose'
import { get } from 'lodash'
import { SessionDocument, SessionModel } from '@src/models/session.model'
import { signJWT, verifyJWT } from '@src/middleware/issueTokenPair'
import { findUser } from './user.services'

export async function createSession(userId: string, userAgent: string) {
  try {
    const session = await SessionModel.create({ user: userId, userAgent })
    return session.toJSON()
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function findSession(query: FilterQuery<SessionDocument>) {
  try {
    const session = await SessionModel.find(query).lean()
    return session
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function updateSession(query: FilterQuery<SessionDocument>, updateQuery: UpdateQuery<SessionDocument>) {
  try {
    return SessionModel.updateOne(query, updateQuery).lean()
  } catch (error) {
    throw new Error(error.message)
  }
}

export async function reIssueAccessToken(token) {
  const { payload, expired } = verifyJWT(token)
  if (!payload || !get(payload, 'sessionId') || expired) return false

  const session = await findSession({ _id: payload.sessionId, valid: true })

  if (!session || !session[0].valid) return false
  const user = await findUser(session[0].user, 'id')
  if (!user) return false

  const accessToken = signJWT({ ...user, sessionId: session[0]._id }, process.env.access_token_life)
  const refreshToken = signJWT({ sessionId: session[0]._id }, process.env.refresh_token_life)

  return { accessToken, refreshToken }
}

export async function deleteSession(query: FilterQuery<SessionDocument>) {
  return SessionModel.findOneAndDelete(query)
}
