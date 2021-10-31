import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { User } from '@src/Models/UserModel'

/**
 *? 1. При логине /login, клиент получает пару jwt + refresh token
 *? 2. Когда jwt невалиден, клиент должен отправить запрос на /refresh чтобы получить свежую пару jwt + refresh token,
 *?      при этом, refresh token должен быть тем же, что и в базе данных.
 *?     jwt является многоразовым, refresh token является одноразовым
 *?      Как только мы отправили запрос на /refresh, старая пара невалидна и мы получаем новую пару.
 */

async function issueTokenPair(userId) {
  const newRefreshToken = uuidv4()
  const doc = await User.findById({ _id: userId })
  if (!doc) {
    throw new Error('No user found')
  }
  doc.refreshToken = newRefreshToken
  await doc.save()

  return {
    token: jwt.sign({ id: doc._id }, process.env.JWT_TOKEN, { expiresIn: '10m' }),
    refreshToken: newRefreshToken,
  }
}

// @desc     Authenticate user & get token
// @route    POST /api/user
// @access   Public
const authUser = asyncHandler(async (req, res) => {
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
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const refreshToken = asyncHandler(async (req, res) => {
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
    res.status(401)
    throw new Error('Invalid refresh token')
  }
})

export { authUser, refreshToken }
