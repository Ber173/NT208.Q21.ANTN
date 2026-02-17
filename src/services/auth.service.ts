/* eslint-disable no-useless-catch */

import jwt from 'jsonwebtoken'
import User, { IUser } from '~/models/user.model'
import { env } from '~/config/environment'

// ==============================
// Types
// ==============================

interface RegisterInput {
  username: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
}

interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

// ==============================
// Generate JWT Token
// ==============================

const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRE as any }
  )
}

// ==============================
// REGISTER
// ==============================

const register = async (
  userData: RegisterInput
): Promise<{ user: any; token: string }> => {
  try {
    const { username, email, password } = userData

    if (!username || !email || !password) {
      throw new Error('Please provide username, email and password')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase()
    })

    if (emailExists) {
      throw new Error(
        'Email already registered. Please use another email or login.'
      )
    }

    const usernameExists = await User.findOne({ username })

    if (usernameExists) {
      throw new Error(
        'Username already taken. Please choose another username.'
      )
    }

    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password
    })

    const token = generateToken(user._id.toString())

    const userObject = user.toJSON()

    return {
      user: userObject,
      token
    }
  } catch (error) {
    throw error
  }
}

// ==============================
// LOGIN
// ==============================

const login = async (
  loginData: LoginInput
): Promise<{ user: any; token: string }> => {
  try {
    const { email, password } = loginData

    if (!email || !password) {
      throw new Error('Please provide email and password')
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+password')

    if (!user) {
      throw new Error('Invalid email or password')
    }

    if (!user.isActive) {
      throw new Error(
        'Your account has been deactivated. Please contact support.'
      )
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
      throw new Error('Invalid email or password')
    }

    const token = generateToken(user._id.toString())

    const userObject = user.toJSON()

    return {
      user: userObject,
      token
    }
  } catch (error) {
    throw error
  }
}

// ==============================
// GET CURRENT USER
// ==============================

const getCurrentUser = async (
  userId: string
): Promise<IUser> => {
  try {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated')
    }

    return user
  } catch (error) {
    throw error
  }
}

// ==============================
// UPDATE PROFILE
// ==============================

const updateProfile = async (
  userId: string,
  updateData: any
): Promise<IUser> => {
  try {
    delete updateData.password
    delete updateData.role
    delete updateData.isActive

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    ).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    throw error
  }
}

// ==============================
// CHANGE PASSWORD
// ==============================

const changePassword = async (
  userId: string,
  passwordData: ChangePasswordInput
): Promise<{ message: string }> => {
  try {
    const { currentPassword, newPassword } = passwordData

    if (!currentPassword || !newPassword) {
      throw new Error(
        'Please provide current password and new password'
      )
    }

    if (newPassword.length < 6) {
      throw new Error(
        'New password must be at least 6 characters'
      )
    }

    const user = await User.findById(userId).select('+password')

    if (!user) {
      throw new Error('User not found')
    }

    const isPasswordCorrect =
      await user.comparePassword(currentPassword)

    if (!isPasswordCorrect) {
      throw new Error('Current password is incorrect')
    }

    user.password = newPassword
    await user.save()

    return {
      message: 'Password changed successfully'
    }
  } catch (error) {
    throw error
  }
}

export default {
  register,
  login,
  getCurrentUser,
  updateProfile,
  changePassword
}
