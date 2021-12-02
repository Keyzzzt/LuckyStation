/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import { v4 as uuidv4 } from 'uuid'
import nodeMailer from 'nodemailer'
import { UserModel } from '@src/models/user.model'
import { ApiError } from '@src/middleware/error.middleware'
import { tokenService } from '@src/newServices/token.service'

const transporter = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // TODO: WTF
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export const userService = {
  activate: async (activationLink: string) => {
    const user = await UserModel.findOne({ activationLink })
    if (!user) throw ApiError.BadRequest('Activation link is not valid.')
    user.isActivated = true
    await user.save()
  },
  register: async (email: string, password: string) => {
    const user = await UserModel.findOne({ email })
    if (user) throw ApiError.BadRequest('User already exists')

    const activationLink = uuidv4()

    const createdUser = await UserModel.create({ email, password, activationLink })

    userService.sendActivationMail(
      email,
      `${process.env.SERVER_ROOT_URI}/api/activate/${activationLink}`
    )
    const tokens = tokenService.generateTokens({
      id: createdUser._id,
      email,
      isActivated: createdUser.isActivated,
      isAdmin: createdUser.isAdmin,
    })

    tokenService.saveToken(createdUser._id, tokens.refreshToken)
    return tokens.refreshToken
  },
  login: async (email: string, password: string) => {
    const user = await UserModel.findOne({ email })
    if (!user) throw ApiError.BadRequest('User not found')
    if (!(await user.comparePassword(password))) {
      throw ApiError.BadRequest('Wrong email or password')
    }
    if (!user.isActivated)
      throw ApiError.BadRequest(
        `Please confirm your email address. Activation link has been set to ${email}`
      )
    const tokens = tokenService.generateTokens({
      id: user._id,
      email,
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
    })
    tokenService.saveToken(user._id, tokens.refreshToken)
    return {
      ...tokens,
      user: {
        id: user._id,
        email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      },
    }
  },
  sendActivationMail: async (to, link) => {
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account for Lucky Station activation link`,
      text: '',
      html: `
          <div>
          <h1>To activate your account please click link below</h1>
          <a href="${link}">${link}</a>
          </div>
      `,
    })
  },
  refresh: async (refreshToken: string) => {
    if (!refreshToken) throw ApiError.UnauthorizedError()
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

    const user = await UserModel.findById(userData.id)
    const tokens = tokenService.generateTokens({
      id: user._id,
      email: user.email,
      isActivated: user.isActivated,
      isAdmin: user.isAdmin,
    })
    await tokenService.saveToken(user._id, tokens.refreshToken)
    return {
      ...tokens,
      user: {
        id: user._id,
        email: user.email,
        isActivated: user.isActivated,
        isAdmin: user.isAdmin,
      },
    }
  },
}
