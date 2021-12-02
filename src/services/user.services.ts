/* eslint-disable camelcase */
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'
import { UserModel, UserDoc } from '@src/models/user.model'
import { IGoogleProfile } from '@src/01_Types/Types'
// import { GoogleUserProfile } from '@src/Types'

dotenv.config()

// TODO Сделать запрос, чтобы приходил без пароля.
export async function findUser(query: FilterQuery<UserDoc>, type: string) {
  let user
  switch (type) {
    case 'id':
      user = await UserModel.findById(query).select('-password')
      break
    case 'email':
      user = await UserModel.findOne(query)
      break
    case 'all':
      user = await UserModel.find(query)
      break
    default:
      user = undefined
  }
  return user
}

export async function findAndUpdateUser(query: FilterQuery<UserDoc>, update: UpdateQuery<UserDoc>, options: QueryOptions) {
  return UserModel.findOneAndUpdate(query, update, options)
}

type CreateUserInput = {
  name: string
  email: string
  password: string
}
export async function createUser(input: CreateUserInput) {
  try {
    return UserModel.create(input)
  } catch (error) {
    throw new Error(error)
  }
}

interface GoogleTokens {
  access_token: string
  expiresIn: number
  refresh_token: string
  scope: string
  id_token: string
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

// This function can be used for getting google user profile with request
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
