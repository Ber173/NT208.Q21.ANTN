// =======================================================
// AUTH ROUTES - TypeScript Version
// =======================================================

import { Router } from 'express'
import authController from '~/controllers/auth.controller'
import { protect } from '~/middlewares/auth.middleware'

const router: Router = Router()

// =======================================================
// PUBLIC ROUTES
// =======================================================

router.post('/register', authController.register)

router.post('/login', authController.login)

router.post('/logout', authController.logout)

// =======================================================
// PROTECTED ROUTES
// =======================================================

router.get('/me', protect, authController.getMe)

router.put('/profile', protect, authController.updateProfile)

router.put('/change-password', protect, authController.changePassword)

// Export router
export default router
