import express, { Router } from 'express'
import { getProfile, updateProfile } from '@src/Controllers/user.controller'
import { privateRoute } from '@src/middleware/auth.middleware'

const router: Router = express.Router()

router.route('/profile').get(privateRoute, getProfile).put(privateRoute, updateProfile)

export default router
