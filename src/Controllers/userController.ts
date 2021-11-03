/* eslint-disable no-underscore-dangle */
import { Request } from 'express'
import asyncHandler from 'express-async-handler'
import { User } from '@src/Models/UserModel'
import { issueTokenPair } from '@src/middleware/issueTokenPair'

// TODO remove any

/**
 *? 1. При логине /login, клиент получает пару jwt + refresh token
 *? 2. Когда jwt невалиден, клиент должен отправить запрос на /refresh чтобы получить свежую пару jwt + refresh token,
 *?      при этом, refresh token должен быть тем же, что и в базе данных.
 *?     jwt является многоразовым, refresh token является одноразовым
 *?      Как только мы отправили запрос на /refresh, старая пара невалидна и мы получаем новую пару.
 */

// @desc     Authenticate user & get token + refresh token.
// @route    POST /api/user
// @access   Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    const { token, refreshToken } = await issueTokenPair(user._id)
    // Найти юзера и записать ему refreshToken  в бфзу данных
    res.json({
      resultCode: 1,
      errorMessage: [],
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
        refreshToken,
      },
    })
  } else {
    res.status(401).json({
      resultCode: 1,
      errorMessage: ['Invalid email or password'],
      data: null,
    })
  }
})

// @desc     Logout
// @route    DELETE /api/user
// @access   Public
export const logout = asyncHandler(async (req: any, res) => {
  const { _id } = req.user._id
  const user = await User.findById(_id)
  if (user) {
    user.refreshToken = ''
    await user.save()
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: null,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: null,
    })
  }
})

// @desc     Refresh JWT & refresh tokens.
// @route    POST /api/user/refresh
// @access   Private
export const updateRefreshToken = asyncHandler(async (req, res) => {
  const { _id, refreshToken } = req.body
  const doc = await User.findById({ _id })

  if (doc && doc.refreshToken === refreshToken) {
    const { token, refreshToken: newRefreshToken } = await issueTokenPair(doc._id)
    res.json({
      resultCode: 1,
      errorMessage: [],
      data: {
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        isAdmin: doc.isAdmin,
        token,
        refreshToken: newRefreshToken,
      },
    })
  } else {
    res.status(401).json({
      resultCode: 0,
      errorMessage: ['Invalid refresh token'],
      data: null,
    })
  }
})

// @desc     Get user own profile
// @route    GET /api/user/profile
// @access   Private
// TODO OBS НЕ ВОЗВРАЩАЕТ ТОКЕНЫ, правильно это или нет ХЗ
export const getProfile = asyncHandler(async (req: any, res) => {
  let user
  if (req.user) {
    const { _id } = req.user._id
    user = await User.findById(_id)
  }
  if (user) {
    res.status(200).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: user,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: null,
    })
  }
})

// @desc     Update user profile
// @route    PUT /api/user/profile
// @access   Private
export const updateProfile = asyncHandler(async (req: any, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      // password will be encrypted automatically, check UserModel.ts
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    if (updatedUser) {
      const { token, refreshToken } = await issueTokenPair(updatedUser._id)
      res.status(200).json({
        resultCode: 1,
        errorMessage: [],
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token,
          refreshToken,
        },
      })
    }
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['User not found'],
      data: null,
    })
  }
})

// @desc     Get user own profile
// @route    GET /api/user/profile
// @access   Private
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400).json({
      resultCode: 0,
      errorMessage: ['User already exists'],
      data: null,
    })
  }
  const user = await User.create({ name, email, password, refreshToken: '' })
  if (user) {
    const { token, refreshToken } = await issueTokenPair(user._id)
    res.status(201).json({
      resultCode: 1,
      errorMessage: [],
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token,
        refreshToken,
      },
    })
  }
})

// @desc     Get all users
// @route    GET /api/user
// @access   Private & Admin
export const getAllUsers = asyncHandler(async (req: any, res) => {
  const users = await User.find({})
  if (users && users.length > 0) {
    res.status(200).json({
      resultCode: 1,
      errorMessage: [],
      data: users,
    })
  } else {
    res.status(404).json({
      resultCode: 0,
      errorMessage: ['Users not found'],
      data: null,
    })
  }
})
