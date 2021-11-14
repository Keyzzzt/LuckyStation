/* eslint-disable consistent-return */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */

import { CookieOptions, Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'
import { RequestCustom } from '@src/custom'
import { getGoogleOAuthTokens, findAndUpdateUser, findUser, createUser } from '@src/services/user.services'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { signJWT } from '@src/middleware/issueTokenPair'
import { createSession, findSession, deleteSession } from '@src/services/session.services'
import { UserModel } from '@src/models/user.model'
import { SessionModel } from '@src/models/session.model'

export const accessTokenOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 90000, // 15 minutes
  domain: 'localhost',
  path: '/',
  sameSite: 'lax',

  secure: false,
}
export const refreshTokenOptions: CookieOptions = { ...accessTokenOptions, maxAge: 3.154e10 }

export async function login(req: RequestCustom, res: Response) {
  try {
    const { email, password } = req.body
    // Проверить есть ли такой пользователь по email
    let user = await UserModel.findOne({ email })
    if (!user) throw new Error('Wrong credentials')

    // Проверить пароль
    if (!(await user.comparePassword(password))) throw new Error('Wrong credentials')
    user = omit(user.toJSON(), 'password', '__v', 'createdAt', 'updatedAt')

    // Проверить есть ли у этого пользователя сессия, если да - удалить.
    await SessionModel.findOneAndDelete({ user: user._id })

    const session = await createSession(user._id, req.get('user-agent') || '')

    const accessToken = signJWT({ ...user, sessionId: session._id }, process.env.access_token_life)
    const refreshToken = signJWT({ sessionId: session._id }, process.env.refresh_token_life)

    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)

    return res.status(200).json({
      resultCode: 1,
      message: ['You have successfully logged in.'],
      data: { user },
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'login controller'],
      data: null,
    })
  }
}

export async function auth(req: RequestCustom, res: Response) {
  try {
    const session = await SessionModel.findOne({ user: req.user._id })
    if (!session) throw new Error('Not authorized')

    res.status(200).json({
      resultCode: 1,
      message: [],
      data: {
        user: req.user,
      },
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'auth controller'],
      data: null,
    })
  }
}

export async function logout(req: RequestCustom, res: Response) {
  try {
    const session = await deleteSession({ _id: req.sessionId })
    console.log(session)

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
      message: ['You have successfully logged out.'],
      data: null,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'logout controller'],
      data: null,
    })
  }
}

export async function googleOAuth(req: RequestCustom, res: Response): Promise<void> {
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
    const session = await createSession(user._id, req.get('user-agent') || '')

    // Create access & refresh tokens
    const accessToken = signJWT({ ...user, session: session._id }, process.env.access_token_life)
    const refreshToken = signJWT({ session: session._id }, process.env.refresh_token_life)

    // set cookies
    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)

    // @ts-ignore
    // TODO Может redirect?
    res.status(200).json({
      resultCode: 1,
      message: [],
      data: user,
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

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const user = await findUser({ email }, 'email')
    if (user) throw new Error('User already exists')

    const createdUser = await createUser({ name, email, password })
    if (!createdUser) throw new Error('Server error')

    const session = await createSession(createdUser._id, req.get('user-agent') || '')

    const accessToken = signJWT({ ...createdUser, sessionId: session._id }, process.env.access_token_life)
    const refreshToken = signJWT({ sessionId: session._id }, process.env.refresh_token_life)

    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)

    res.status(200).json({
      resultCode: 1,
      message: ['registration success'],
      data: createdUser,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'register controller'],
      data: null,
    })
  }
}
