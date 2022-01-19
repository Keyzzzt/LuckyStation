/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import { CookieOptions, Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { RequestCustom } from '@src/custom'
import * as utils from '@src/utils'
import { UserModel } from '@src/models/user.model'
import { ApiError } from '@src/middleware/error.middleware'

export const cookieOpt: CookieOptions = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  secure: false,
}
/**
 *? Восстановление пароля
 ** Пользователь вводит имейл который отправляем на сервер.
 ** Находим пользователя, зашиваем его _id в токен. Токен вставляем в ссылку и отправляем на имейл пользователя
 ** По ссылке пользователь переходит на страничку смены пароля. Отсылаем на сервер password, confirm, token из ссылки.
 */
export async function passwordRecoveryLink(req: Request, res: Response, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    const { email } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
      return next(ApiError.NotFound('User not found')) // todo не стоит писать что имейла нет, лучше отправить что то пространное
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESTORE_PASSWORD_KEY, { expiresIn: '30m' })

    utils.sendPasswordRecoveryLink(email, `${process.env.CLIENT_URL}/restore/${token}`)
    user.passwordResetToken = token
    await user.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function passwordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const { password, confirm, passwordResetToken } = req.body
    if (!passwordResetToken) {
      return next(ApiError.NotFound('Reset password token not found'))
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()))
    }

    if (password !== confirm) {
      return next(ApiError.NotFound('Passwords do not match'))
    }
    jwt.verify(passwordResetToken, process.env.JWT_RESTORE_PASSWORD_KEY)

    // @ts-ignore
    const user = await UserModel.findOne({ passwordResetToken })
    if (!user) {
      return next(ApiError.NotFound('User with this reset password token not found'))
    }
    user.password = password

    await user.save()

    return res.sendStatus(200)
  } catch (error) {
    return next(error.message)
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
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

    await utils.handleEmailInStatistics(email, 'allUsersEmailList', 'add')

    const activationToken = jwt.sign({ email }, process.env.JWT_ACTIVATION_KEY, { expiresIn: '24h' })

    await UserModel.create({ email, password, activationToken })

    await utils.sendActivationMail(email, `${process.env.SERVER_ROOT_URI}/api/activate/${activationToken}`)

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
      id: user._id,
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
    const activationToken = req.params.token
    jwt.verify(activationToken, process.env.JWT_ACTIVATION_KEY)

    const user = await UserModel.findOne({ activationToken })
    if (!user) {
      return next(ApiError.BadRequest('User with this activation link not found'))
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

    // Если имейл и googleId совпадают - логиним
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
    // Если имейл совпадает, активирован, имейл гугл верифицирован - логиним с добавлением googleId
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

    // Если имейл совпадает, аккаунт НЕ активирован, имейл гугл верифицирован:
    // Удаляем не активированную учетную запись - создаем новую с добавлением googleId
    if (user && !user.isActivated && googleProfile.verified_email) {
      await user.remove()
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

    // Нет пользовалеля - создаем нового с добавлением googleId
    if (!user) {
      await utils.handleEmailInStatistics(googleProfile.email, 'allUsersEmailList', 'add')

      const createdUser = await UserModel.create({
        email: googleProfile.email,
        googleId: googleProfile.id,
        isActivated: true,
      })

      console.log(typeof createdUser._id)

      const tokens = utils.generateTokens({
        id: createdUser._id, // todo change to _id
        email: googleProfile.email,
        isActivated: true,
        isAdmin: createdUser.isAdmin,
      })
      utils.saveToken(createdUser._id, tokens.refreshToken)
      res.cookie('refreshToken', tokens.refreshToken, cookieOpt)
      return res.redirect('http://localhost:3000')
    }
    // Если не ничего не сработало из условий сверху вернем ошибку сервера.
    return res.sendStatus(500)
  } catch (error) {
    return next(error.message)
  }
}
