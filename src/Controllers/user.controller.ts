/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-underscore-dangle */
import { Response } from 'express'
import { RequestCustom } from '@src/custom'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { UserModel } from '@src/models/user.model'

export const getProfile = async (req: RequestCustom, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id)
    if (!user) throw new Error('User not found')

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
    const updatedUser = await user.save()
    if (updatedUser) {
      res.status(200).json({
        resultCode: 1,
        message: [],
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
        },
      })
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      message: [error.message, 'updateProfile controller'],
      data: null,
    })
  }
}
