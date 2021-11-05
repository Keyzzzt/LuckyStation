/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express'
import { issueStatusCode } from '@src/middleware/issueStatusCode'
import { createUser, findUser, loginUser } from '@src/services/user.services'
import { issueTokenPair } from '@src/middleware/issueTokenPair'

// TODO change UserBody to generic type where name and password are optional
type UserBody = {
  name: string
  email: string
  password: string
}

// @desc     Register user
// @route    POST /api/user
// @access   Private
export const registerUser = async (req: Request<any, any, UserBody, any>, res: Response) => {
  try {
    const { name, email, password } = req.body
    const user = await findUser({ email }, 'email')
    if (user) throw new Error('User already exists')

    const createdUser = await createUser({ name, email, password })
    if (!createdUser) throw new Error('Server error')

    const { accessToken, refreshToken } = await issueTokenPair(createdUser._id)
    res.status(201).json({
      resultCode: 1,
      errorMessage: [],
      data: {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'registerUser controller'],
      data: null,
    })
  }
}

// @desc     Authenticate user & get token + refresh token.
// @route    POST /api/user/login
// @access   Public
export const login = async (req: Request<any, any, UserBody, any>, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await loginUser({ email, password })

    const { accessToken, refreshToken } = await issueTokenPair(user._id)
    user.accessToken = accessToken
    user.refreshToken = refreshToken
    res.json({
      resultCode: 1,
      errorMessage: [],
      data: user,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'login controller'],
      data: null,
    })
  }
}

// @desc     Logout
// @route    DELETE /api/user
// @access   Public
// TODO Исправить после JWT функционала,
// TODO Удалить JWT на клиенте, поскольку тут мы только удаляем refreshToken
export const logout = async (req: Request, res: Response) => {
  try {
    const { _id } = res.locals.user
    const user = await findUser({ _id }, 'id')
    // TODO  Подумать куда его послать, если такой не найден
    // if(!user) res.redirect()
    user.refreshToken = ''
    await user.save()
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: null,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'logout controller'],
      data: null,
    })
  }
}

// @desc     Refresh JWT & refresh tokens.
// @route    POST /api/user/refresh
// @access   Private
// TODO Исправить после JWT функционала
export const updateRefreshToken = async (req: Request, res: Response) => {
  try {
    const { _id, refreshToken } = req.body
    const user = await findUser({ _id }, 'id')
    if (!user) throw new Error('User not found')

    if (user.refreshToken === refreshToken) {
      const { accessToken, refreshToken: newRefreshToken } = await issueTokenPair(user._id)
      res.json({
        resultCode: 1,
        errorMessage: [],
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          accessToken,
          refreshToken: newRefreshToken,
        },
      })
    } else {
      throw new Error('Not authorized')
    }
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'updateRefreshToken controller'],
      data: null,
    })
  }
}

// @desc     Get own profile
// @route    GET /api/user/profile
// @access   Private
// TODO OBS НЕ ВОЗВРАЩАЕТ ТОКЕНЫ, правильно это или нет ХЗ
// TODO Исправить после JWT функционала
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { _id } = res.locals.user._id
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

// @desc     Update user profile
// @route    PUT /api/user/profile
// @access   Private
export const updateProfile = async (req: Request<any, any, UserBody, any>, res: Response) => {
  try {
    const { _id } = res.locals.user
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

// @desc     Get all users
// @route    GET /api/user
// @access   Private & Admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await findUser({}, 'all')
    if (!users || users.length === 0) throw new Error('Users not found')

    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: users,
    })
  } catch (error) {
    res.status(issueStatusCode(error.message)).json({
      resultCode: 0,
      errorMessage: [error.message, 'updateProfile controller'],
      data: null,
    })
  }
}
