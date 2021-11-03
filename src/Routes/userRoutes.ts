import express from 'express'
import { login, logout, updateRefreshToken, getProfile, registerUser, updateProfile } from '@src/Controllers/userController'
import { getAllUsers, deleteUserById, getUserById, updateUserProfileByAdmin } from '@src/Controllers/adminController'
import { privateRoute, adminRoute } from '@src/middleware/authMiddleware'

const router = express.Router()

router.route('/').post(registerUser).get(privateRoute, adminRoute, getAllUsers)
router.route('/login').post(login).delete(privateRoute, logout)
router.route('/logout').post(logout)
router.route('/refresh').post(updateRefreshToken)
router.route('/profile').get(privateRoute, getProfile).put(privateRoute, updateProfile)
router
  .route('/:id')
  .delete(privateRoute, adminRoute, deleteUserById)
  .get(privateRoute, adminRoute, getUserById)
  .put(privateRoute, adminRoute, updateUserProfileByAdmin)

export default router
