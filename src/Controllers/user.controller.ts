/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Response } from 'express'
import { omit } from 'lodash'
import { RequestCustom } from '@src/custom'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { UserModel } from '@src/models/user.model'
import { signJWT } from '@src/middleware/issueTokenPair'
import { accessTokenOptions, refreshTokenOptions } from './session.controller'

export const getProfile = async (req: RequestCustom, res: Response) => {
  try {
    let user = await UserModel.findById(req.user._id)
    if (!user) throw new Error('User not found')
    user = omit(user.toJSON(), 'password', '__v', 'createdAt', 'updatedAt')

    res.status(200).json({
      resultCode: 1,
      message: [],
      data: user,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'getProfile controller'],
      data: null,
    })
  }
}

export const updateProfile = async (req: RequestCustom, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id)
    if (!user) throw new Error('User not found')

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    let updatedUser = await user.save()
    updatedUser = omit(updatedUser.toJSON(), 'password', '__v', 'createdAt', 'updatedAt')

    const accessToken = signJWT({ ...updatedUser, sessionId: req.user.sessionId }, process.env.access_token_life)
    const refreshToken = signJWT({ sessionId: req.user.sessionId }, process.env.refresh_token_life)

    res.cookie('accessToken', accessToken, accessTokenOptions)
    res.cookie('refreshToken', refreshToken, refreshTokenOptions)

    res.status(200).json({
      resultCode: 1,
      message: ['You have successfully updated profile.'],
      data: updatedUser,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'updateProfile controller'],
      data: null,
    })
  }
}
