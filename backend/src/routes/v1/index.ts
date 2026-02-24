// =======================================================
// ROUTES V1 INDEX - TypeScript Version
// =======================================================

import { Router, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import authRoutes from '~/routes/v1/auth.route'
import userRoutes from '~/routes/v1/user.route'

const router: Router = Router()

// =======================================================
// API STATUS CHECK
// GET /api/v1/status
// =======================================================

router.get('/status', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'API V1 is working',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// =======================================================
// API ROUTES
// =======================================================

// Authentication routes → /api/v1/auth
router.use('/auth', authRoutes)

// User routes → /api/v1/users
router.use('/users', userRoutes)

export default router
