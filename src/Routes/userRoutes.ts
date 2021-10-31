import express from 'express'
import { login, logout, updateRefreshToken, getProfile, registerUser, updateProfile } from '@src/Controllers/userController'
import { privateRoute } from '@src/middleware/authMiddleware'

const router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(login)
router.route('/logout').post(logout)
router.route('/refresh').post(updateRefreshToken)
router.route('/profile').get(privateRoute, getProfile).put(privateRoute, updateProfile)

export default router
