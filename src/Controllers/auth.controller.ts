/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { CookieOptions, Response, Request, NextFunction } from 'express'
import { RequestCustom } from '@src/custom'
import { userService } from '@src/newServices/user.service'
import { getGoogleOAuthTokens, findAndUpdateUser, findUser, createUser, getGoogleUserProfile } from '@src/services/user.services'
import { UserModel } from '@src/models/user.model'

export const cookieOpt: CookieOptions = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: false,
}

// TODO: refactor
export async function googleOAuth(req: RequestCustom, res: Response): Promise<void> {
  // try {
  //   // Get the code from query strings
  //   const code = req.query.code as string
  //   // get the id and access token with the code from google api
  //   const { id_token, access_token } = await getGoogleOAuthTokens({ code })
  //   // get user with token
  //   const profile = await getGoogleUserProfile({ id_token, access_token })
  //   const user = await UserModel.findOne({ googleId: profile.id })
  //   if (!user) {
  //     const newUser = await new UserModel({
  //       name: profile.name,
  //       email: profile.email,
  //       googleId: profile.id,
  //       logo: profile.picture,
  //     }).save()
  //     const session = await createSession(newUser._id, req.get('user-agent') || '')
  //     const accessToken = signJWT({ ...newUser, session: session._id }, process.env.access_token_life)
  //     const refreshToken = signJWT({ session: session._id }, process.env.refresh_token_life)
  //     res.cookie('accessToken', accessToken, accessTokenOptions)
  //     res.cookie('refreshToken', refreshToken, refreshTokenOptions)
  //     res.status(200).json({
  //       resultCode: 1,
  //       message: [],
  //       user: newUser,
  //     })
  //   }
  //   const session = await createSession(user._id, req.get('user-agent') || '')
  //   // Create access & refresh tokens
  //   const accessToken = signJWT({ ...user, session: session._id }, process.env.access_token_life)
  //   const refreshToken = signJWT({ session: session._id }, process.env.refresh_token_life)
  //   // set cookies
  //   res.cookie('accessToken', accessToken, accessTokenOptions)
  //   res.cookie('refreshToken', refreshToken, refreshTokenOptions)
  //   res.status(200).json({
  //     resultCode: 1,
  //     message: [],
  //     user,
  //   })
  // } catch (error) {
  //   res.status(issueStatusCode(error.message)).json({
  //     resultCode: 0,
  //     errorMessage: [error.message, 'googleOauth controller'],
  //     data: null,
  //   })
  // }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body

    const { data, token } = await userService.register(name, email, password)

    res.cookie('refreshToken', token.refreshToken, cookieOpt)

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body
    const data = await userService.login(email, password)
    res.cookie('refreshToken', data.refreshToken, cookieOpt)
    delete data.refreshToken

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies
    const data = await userService.logout(refreshToken)
    res.clearCookie('refreshToken')
    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}

export async function activate(req: Request, res: Response, next: NextFunction) {
  try {
    const activationLink = req.params.link
    await userService.activate(activationLink)
    return res.redirect(process.env.CLIENT_URL)
  } catch (error) {
    return next(error)
  }
}
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies

    const data = await userService.refresh(refreshToken)

    res.cookie('refreshToken', data.refreshToken, cookieOpt)

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}
