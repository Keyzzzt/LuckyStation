import express, { Router } from 'express'
import { login, logout, updateRefreshToken, getProfile, registerUser, updateProfile } from '@src/Controllers/user.controller'
import { privateRoute } from '@src/middleware/auth.middleware'

const router: Router = express.Router()

router.route('/').post(registerUser)
router.route('/login').post(login).delete(privateRoute, logout)
router.route('/refresh').post(updateRefreshToken)
router.route('/profile').get(privateRoute, getProfile).put(privateRoute, updateProfile)

export default router
