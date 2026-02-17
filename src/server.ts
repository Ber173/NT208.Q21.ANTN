// =======================================================
// SERVER ENTRY POINT
// =======================================================

import express, { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import cors from 'cors'

import { env } from '~/config/environment'
import { corsOptions } from '~/config/cors'
import connectDatabase from '~/config/database'
import routesV1 from '~/routes/v1'

// =======================
// Hàm khởi động server
// =======================
const START_SERVER = (): void => {
  const app = express()

  // =======================
  // Middleware
  // =======================

  app.use(cors(corsOptions))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // =======================
  // API Routes
  // =======================
  app.use('/api/v1', routesV1)

  // =======================
  // Health check endpoint
  // =======================
  app.get('/', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
      message: 'English Learning API is running!',
      version: '1.0.0',
      status: 'active'
    })
  })

  // =======================
  // Error handling middleware
  // =======================
  app.use(
    (
      err: any,
      req: Request,
      res: Response,
      next: NextFunction
    ): void => {
      console.error('Error:', err?.stack)

      res
        .status(err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          message: err?.message || 'Internal Server Error',
          ...(env.NODE_ENV === 'development' && { stack: err?.stack })
        })
    }
  )

  // =======================
  // 404 handler
  // =======================
  app.use((req: Request, res: Response) => {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Route not found' })
  })

  // =======================
  // Start server
  // =======================
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`
    )
    console.log(`Environment: ${env.NODE_ENV}`)
  })
}

// ======================================================
// Kết nối database trước rồi mới start server
// ======================================================

;(async (): Promise<void> => {
  try {
    await connectDatabase()
    START_SERVER()
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
})()
