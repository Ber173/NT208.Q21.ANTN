// =======================================================
// AUTH CONTROLLER - TypeScript Version
// =======================================================

import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import authService from '~/services/auth.service'

// Minimal typing cho req.user
interface AuthRequest extends Request {
  user?: any
}

/**
 * REGISTER
 */
const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }

    const result = await authService.register(userData)

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * LOGIN
 */
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const loginData = {
      email: req.body.email,
      password: req.body.password
    }

    const result = await authService.login(loginData)

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET CURRENT USER
 */
const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id

    const user = await authService.getCurrentUser(userId)

    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * UPDATE PROFILE
 */
const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id
    const updateData = req.body

    const user = await authService.updateProfile(userId, updateData)

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * CHANGE PASSWORD
 */
const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id

    const passwordData = {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword
    }

    const result = await authService.changePassword(userId, passwordData)

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message
    })
  } catch (error) {
    next(error)
  }
}

/**
 * LOGOUT
 */
const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message:
        'Logged out successfully. Please remove your token from client.'
    })
  } catch (error) {
    next(error)
  }
}

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
}
