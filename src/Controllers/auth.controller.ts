/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { CookieOptions, Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestCustom } from '@src/custom'
import { userService } from '@src/newServices/user.service'
import { getGoogleOAuthTokens, getGoogleUserProfile } from '@src/services/user.services'
import { UserModel } from '@src/models/user.model'
import { ApiError } from '@src/middleware/error.middleware'
import { tokenService } from '@src/newServices/token.service'
import { getGoogleOAuthURL } from '@src/services/googleOAuthURL'

export const cookieOpt: CookieOptions = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: false,
}

export function googleOAuthRedirect(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    res.redirect(getGoogleOAuthURL())
  } catch (error) {
    next(error)
  }
}

export async function googleOAuth(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const code = req.query.code as string
    const { id_token, access_token } = await getGoogleOAuthTokens({ code })
    const googleProfile = await getGoogleUserProfile({ id_token, access_token })

    const user = await UserModel.findOne({ email: googleProfile.email })

    if (user && user.googleId === googleProfile.id) {
      const tokens = tokenService.generateTokens({
        id: user._id,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      })
      tokenService.saveToken(user._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

      return res.redirect('http://localhost:3000')
    }
    if (user && user.isActivated && googleProfile.verified_email) {
      user.googleId = googleProfile.id
      const tokens = tokenService.generateTokens({
        id: user._id,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      })
      tokenService.saveToken(user._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

      return res.redirect('http://localhost:3000')
    }
    if (user && !user.isActivated && googleProfile.verified_email) {
      await user.remove()
      // TODO: Отправить мейл об удалении неактивированного аккаунта. Ссылку на активирование сделать невалидной.
      const createdUser = await UserModel.create({
        email: googleProfile.email,
        googleId: googleProfile.id,
        isActivated: true,
      })
      const tokens = tokenService.generateTokens({
        id: createdUser._id,
        email: googleProfile.email,
        isActivated: true,
        isAdmin: createdUser.isAdmin,
      })
      tokenService.saveToken(createdUser._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

      return res.redirect('http://localhost:3000')
    }
    if (!user) {
      const createdUser = await UserModel.create({
        email: googleProfile.email,
        googleId: googleProfile.id,
        isActivated: true,
      })
      const tokens = tokenService.generateTokens({
        id: createdUser._id,
        email: googleProfile.email,
        isActivated: true,
        isAdmin: createdUser.isAdmin,
      })
      tokenService.saveToken(user._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)
      return res.redirect('http://localhost:3000')
    }
  } catch (error) {
    return next(error)
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  // TODO: Проверить если есть с имейлом от регистрации с Google
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { email, password } = req.body
    const refreshToken = await userService.register(email, password)
    res.cookie('refreshToken', refreshToken, cookieOpt)

    return res.sendStatus(200)
  } catch (error) {
    return next(error)
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

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
    await tokenService.removeToken(refreshToken)
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
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
    delete data.refreshToken

    return res.status(200).json(data)
  } catch (error) {
    return next(error)
  }
}
