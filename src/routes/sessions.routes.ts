import express, { Router } from 'express'
import {
  googleOauth,
  createSessionHandler,
  getSessionController,
  deleteSessionHandler,
  commonRegistration,
} from '@src/Controllers/session.controller'
import { privateRoute } from '@src/middleware/auth.middleware'

const router: Router = express.Router()
// login
router.route('/sessions').post(createSessionHandler)
router.route('/sessions').get(privateRoute, getSessionController)
router.route('/sessions').delete(privateRoute, deleteSessionHandler)
router.route('/sessions/reg').post(commonRegistration)

// get the current sessions

// Logout

// Google OAuth
router.route('/sessions/oauth/google').get(googleOauth)

export default router
