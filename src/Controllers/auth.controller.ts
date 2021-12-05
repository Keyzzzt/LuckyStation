/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { CookieOptions, Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'
import { RequestCustom } from '@src/custom'
import * as utils from '@src/utils'
import { UserModel } from '@src/models/user.model'
import { ApiError } from '@src/middleware/error.middleware'

export const cookieOpt: CookieOptions = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: false,
}

export function googleOAuthRedirect(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    return res.redirect(utils.getGoogleOAuthURL())
  } catch (error) {
    return next(error.error)
  }
}
export async function googleOAuth(req: RequestCustom, res: Response, next: NextFunction) {
  try {
    const code = req.query.code as string
    const { id_token, access_token } = await utils.getGoogleOAuthTokens({ code })
    const googleProfile = await utils.getGoogleUserProfile({ id_token, access_token })

    const user = await UserModel.findOne({ email: googleProfile.email })

    if (user && user.googleId === googleProfile.id) {
      const tokens = utils.generateTokens({
        id: user._id,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      })
      utils.saveToken(user._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

      return res.redirect('http://localhost:3000')
    }
    if (user && user.isActivated && googleProfile.verified_email) {
      user.googleId = googleProfile.id
      const tokens = utils.generateTokens({
        id: user._id,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      })
      utils.saveToken(user._id, tokens.refreshToken)
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
      const tokens = utils.generateTokens({
        id: createdUser._id,
        email: googleProfile.email,
        isActivated: true,
        isAdmin: createdUser.isAdmin,
      })
      utils.saveToken(createdUser._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

      return res.redirect('http://localhost:3000')
    }
    if (!user) {
      const createdUser = await UserModel.create({
        email: googleProfile.email,
        googleId: googleProfile.id,
        isActivated: true,
      })
      const tokens = utils.generateTokens({
        id: createdUser._id,
        email: googleProfile.email,
        isActivated: true,
        isAdmin: createdUser.isAdmin,
      })
      utils.saveToken(user._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)
      return res.redirect('http://localhost:3000')
    }
  } catch (error) {
    return next(error.message)
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
    const user = await UserModel.findOne({ email })
    if (user) {
      return next(ApiError.BadRequest('User already exists'))
    }

    const activationLink = uuidv4()

    const createdUser = await UserModel.create({ email, password, activationLink })

    utils.sendActivationMail(email, `${process.env.SERVER_ROOT_URI}/api/activate/${activationLink}`)
    const tokens = utils.generateTokens({
      id: createdUser._id,
      email,
      isActivated: createdUser.isActivated,
      isAdmin: createdUser.isAdmin,
    })

    utils.saveToken(createdUser._id, tokens.refreshToken)
    res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

    return res.sendStatus(201)
  } catch (error) {
    return next(error.message)
  }
}
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { email, password } = req.body
    // const data = await userService.login(email, password)
    const user = await UserModel.findOne({ email })
    if (!user) {
      return next(ApiError.NotFound('User not found. Have you activated your account?'))
    }
    if (!(await user.comparePassword(password))) {
      return next(ApiError.BadRequest('User not found. Have you activated your account?'))
    }
    if (!user.isActivated) {
      return next(ApiError.BadRequest(`User not found. Have you activated your account?`))
    }
    const tokens = utils.generateTokens({
      id: user._id,
      email,
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
    })
    utils.saveToken(user._id, tokens.refreshToken)
    res.cookie('refreshToken', tokens.refreshToken, cookieOpt)

    return res.status(200).json({
      accessToken: tokens.accessToken,
      user: {
        id: user._id,
        email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
        isSubscribed: user.isSubscribed,
        favorite: user.favorite,
      },
    })
  } catch (error) {
    return next(error.message)
  }
}
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies
    await utils.removeToken(refreshToken)
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}
export async function activate(req: Request, res: Response, next: NextFunction) {
  try {
    const activationLink = req.params.link
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      return next(ApiError.BadRequest('Activation link is not valid.'))
    }
    user.isActivated = true
    await user.save()
    return res.redirect(process.env.CLIENT_URL)
  } catch (error) {
    return next(error.message)
  }
}
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.cookies

    const data = await utils.refresh(refreshToken)

    res.cookie('refreshToken', data.refreshToken, cookieOpt)
    delete data.refreshToken

    return res.status(200).json(data)
  } catch (error) {
    return next(error.message)
  }
}
