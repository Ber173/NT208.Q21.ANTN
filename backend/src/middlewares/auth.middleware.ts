// =======================================================
// AUTH MIDDLEWARE - TypeScript Version
// =======================================================

import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { env } from '~/config/environment'
import User from '~/models/user.model'

// Mở rộng Express Request để có user
interface AuthRequest extends Request {
  user?: any
}

/**
 * PROTECT - Middleware xác thực JWT
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message:
          'Not authorized to access this route. Please login first.'
      })
      return
    }

    try {
      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      ) as JwtPayload & { id: string }

      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'User not found. Token is invalid.'
        })
        return
      }

      if (!user.isActive) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message:
            'Your account has been deactivated. Please contact support.'
        })
        return
      }

      req.user = user
      next()
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid token. Please login again.'
        })
        return
      }

      if (error.name === 'TokenExpiredError') {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message:
            'Your token has expired. Please login again.'
        })
        return
      }

      throw error
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}

/**
 * ADMIN CHECK
 */
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized as an admin'
    })
  }
}

/**
 * OPTIONAL AUTH
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      next()
      return
    }

    try {
      const decoded = jwt.verify(
        token,
        env.JWT_SECRET
      ) as JwtPayload & { id: string }

      const user = await User.findById(decoded.id).select('-password')

      if (user && user.isActive) {
        req.user = user
      }

      next()
    } catch {
      next()
    }
  } catch {
    next()
  }
}
