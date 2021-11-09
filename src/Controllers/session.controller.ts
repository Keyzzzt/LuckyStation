/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */

import { CookieOptions, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { getGoogleOAuthTokens, findAndUpdateUser, findUser, verifyUser, createUser } from '@src/services/user.services'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { signJWT, verifyJWT } from '@src/middleware/issueTokenPair'
import { createSessionFakeDB, invalidateSessionFakeDB } from '@src/fakeDB'
import { createSession, findSession, updateSession } from '@src/services/session.services'

export const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 90000, // 15 minutes
  domain: 'localhost',
  path: '/',
  sameSite: 'lax',
  secure: false,
}
export const refreshTokenOptions: CookieOptions = { ...accessTokenOptions, maxAge: 3.154e10 }

// deserializeUser отработал
export async function createSessionHandler(req: Request, res: Response) {
  try {
    // @ts-ignore
    if (req.user) throw new Error('User already has a session.')
    const { email, password } = req.body

    const user = await verifyUser({ email, password })
    const session = await createSession(user._id, req.get('user-agent') || '')

    const accessToken = signJWT({ ...user, sessionId: session._id }, process.env.access_token_life)
    const refreshToken = signJWT({ sessionId: session._id }, process.env.refresh_token_life)

    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)
    // @ts-ignore
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      // @ts-ignore
      data: user,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'createSession controller'],
      data: null,
    })
  }
}

// deserializeUser отработал
export async function getSessionController(req: Request, res: Response) {
  try {
    // @ts-ignore
    const session = await findSession({ _id: req.user.sessionId, valid: true })
    // @ts-ignore
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      // @ts-ignore
      data: session,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getSession controller'],
      data: null,
    })
  }
}

export async function deleteSessionHandler(req: Request, res: Response) {
  try {
    // @ts-ignore
    await updateSession({ _id: req.user.sessionId }, { valid: false })

    res.cookie('accessToken', '', {
      maxAge: 0,
      httpOnly: true,
    })
    res.cookie('refreshToken', '', {
      maxAge: 0,
      httpOnly: true,
    })
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: null,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'deleteSession controller'],
      data: null,
    })
  }
}

export async function googleOauth(req, res): Promise<void> {
  try {
    // Get the code from query strings
    const code = req.query.code as string

    // get the id and access token with the code from google api
    const { id_token, access_token } = await getGoogleOAuthTokens({ code })

    // get user with token
    // TODO any
    const googleUser: any = jwt.decode(id_token)
    if (!googleUser.email_verified) {
      throw new Error('Google account is not verified')
    }

    // Upsert the user
    const user = await findAndUpdateUser(
      { email: googleUser.email },
      {
        email: googleUser.email,
        name: googleUser.name,
        logo: googleUser.picture,
      },
      { upsert: true, new: true }
    )
    // Create a session
    // TODO fakeDB, createSession создает объект session c полями id, email, name
    // TODO Создать метод createSession, который будет создавать сессию в базе данных
    // TODO Сделать сессию по _id пользователя а не с имейлом и менем как сейчас.
    const session = createSessionFakeDB(user.email, user.name)

    // Create access & refresh tokens
    const accessToken = signJWT(
      {
        ...user,
        session: session.sessionId, // TODO Взять из базы
      },
      '30m'
    )
    const refreshToken = signJWT(
      {
        ...user,
        session: session.sessionId, // TODO Взять из базы
      },
      '1y'
    )

    // set cookies
    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)

    // @ts-ignore
    // TODO Может redirect?
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: session,
    })
    // redirect back to client
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'googleOauth controller'],
      data: null,
    })
  }
}

type UserBody = {
  name: string
  email: string
  password: string
}
export const commonRegistration = async (req: Request<object, object, UserBody, object>, res: Response) => {
  try {
    const { name, email, password } = req.body
    const user = await findUser({ email }, 'email')
    if (user) throw new Error('User already exists')

    const createdUser = await createUser({ name, email, password })
    if (!createdUser) throw new Error('Server error')
    // TODO:
    const session = createSessionFakeDB(email, createdUser.name)

    const accessToken = signJWT(
      {
        // id: user._id,
        name: createdUser.name,
        email: createdUser.email,
        sessionId: session.sessionId, // TODO Взять из базы
        // isAdmin: user.isAdmin,
        // isSubscribed: user.isSubscribed,
        // createdAt: user.createdAt,
        // sessionId: session.sessionId,
      },
      process.env.access_token_life
    )
    const refreshToken = signJWT(
      {
        sessionId: session.sessionId, // TODO Взять из базы
      },
      process.env.refresh_token_life
    )

    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)
    // @ts-ignore
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: session,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'commonRegistration controller'],
      data: null,
    })
  }
}
