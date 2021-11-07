/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { findUser } from '@src/services/user.services'
import { issueTokenPair } from '@src/middleware/issueTokenPair'

export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { _id } = req.user._id
    const user = await findUser({ _id }, 'id')
    if (!user) throw new Error('User not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: user,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'getProfile controller'],
      data: null,
    })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { _id } = req.user
    const user = await findUser({ _id }, 'id')
    if (!user) throw new Error('User not found')

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    if (updatedUser) {
      const { accessToken, refreshToken } = await issueTokenPair(updatedUser._id)
      res.status(200).json({
        resultCode: 1,
        errorMessage: [],
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          accessToken,
          refreshToken,
        },
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'updateProfile controller'],
      data: null,
    })
  }
}
