import express from 'express'
import { authUser, refreshToken } from '@src/Controllers/userController'

const router = express.Router()

router.route('/auth').post(authUser)
router.route('/refresh').post(refreshToken)

export default router
