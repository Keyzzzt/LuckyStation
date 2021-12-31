/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import qs from 'qs'
import dotenv from 'dotenv'
import { ApiError } from '@src/middleware/error.middleware'
import { UserModel } from '@src/models/user.model'
import { TokenModel } from '@src/models/TokenModel'
import { IGoogleProfile } from './01_Types/Types'
import { GoogleTokens, PayloadType } from './types'

dotenv.config()

const transporter = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export function generateTokens(payload: PayloadType) {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.access_token_life })
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.refresh_token_life })
  return { accessToken, refreshToken }
}
export async function saveToken(userId, refreshToken) {
  const tokenData = await TokenModel.findOne({ user: userId })
  if (tokenData) {
    tokenData.refreshToken = refreshToken
    return tokenData.save()
  }
  const token = await TokenModel.create({ user: userId, refreshToken })
  return token
}
export async function removeToken(refreshToken: string) {
  const token = await TokenModel.deleteOne({ refreshToken })
  return token
}
export async function findToken(refreshToken: string) {
  const token = await TokenModel.findOne({ refreshToken })
  if (!token) {
    throw ApiError.BadRequest('Token session not found')
  }
  return token
}
export function validateAccessToken(token: string): PayloadType | null {
  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as PayloadType
    return user
  } catch (error) {
    return null
  }
}
export function validateRefreshToken(token: string): PayloadType | null {
  try {
    const user = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as PayloadType
    return user
  } catch (error) {
    return null
  }
}

export async function sendActivationMail(to, link) {
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
}
export async function refresh(refreshToken: string) {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError()
  }
  const userData = validateRefreshToken(refreshToken)
  const tokenFromDB = await findToken(refreshToken)
  if (!userData || !tokenFromDB) {
    throw ApiError.UnauthorizedError()
  }
  const user = await UserModel.findById(userData.id)
  const tokens = generateTokens({
    id: user._id,
    email: user.email,
    isActivated: user.isActivated,
    isAdmin: user.isAdmin,
  })
  await saveToken(user._id, tokens.refreshToken)
  return {
    ...tokens,
    id: user._id,
  }
}

export function getGoogleOAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const options = {
    redirect_uri: 'http://localhost:5000/api/auth/google' as string,
    client_id: '194487912642-cpm66l0kq1jl47hdrtg12c0oi040bqnu.apps.googleusercontent.com' as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'].join(' '),
  }

  const _qs = new URLSearchParams(options)

  return `${rootUrl}?${_qs.toString()}`
}

export async function getGoogleOAuthTokens({ code }: { code: string }): Promise<GoogleTokens> {
  const url = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: 'authorization_code',
  }

  const response = await axios.post<GoogleTokens>(url, qs.stringify(values), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  return response.data
}

export async function getGoogleUserProfile({ id_token, access_token }) {
  try {
    const res = await axios.get<IGoogleProfile>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    })
    return res.data
  } catch (error) {
    throw new Error(error.message)
  }
}
