/* eslint-disable no-useless-catch */

import User, { IUser } from '~/models/user.model'

// ==============================
// Types
// ==============================

interface PaginationQuery {
  page?: number
  limit?: number
  sort?: string
  [key: string]: any
}

// ==============================
// CREATE USER
// ==============================

const createUser = async (data: any): Promise<IUser> => {
  try {
    const existingUser = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }]
    })

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new Error('Email already exists')
      }
      if (existingUser.username === data.username) {
        throw new Error('Username already exists')
      }
    }

    const user = await User.create(data)
    return user
  } catch (error) {
    throw error
  }
}

// ==============================
// GET ALL USERS (Pagination)
// ==============================

const getAllUsers = async (
  query: PaginationQuery = {}
): Promise<{
  users: any[]
  totalPages: number
  currentPage: number
  total: number
}> => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    const users = await User.find({ isActive: true })
      .select('-password')
      .sort(sort)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber)
      .lean()

    const count = await User.countDocuments({
      isActive: true
    })

    return {
      users,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
      total: count
    }
  } catch (error) {
    throw error
  }
}

// ==============================
// GET USER BY ID
// ==============================

const getUserById = async (
  id: string
): Promise<IUser> => {
  try {
    const user = await User.findById(id).select('-password')

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    throw error
  }
}

// ==============================
// UPDATE USER
// ==============================

const updateUser = async (
  id: string,
  data: any
): Promise<IUser> => {
  try {
    delete data.password

    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
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
// DELETE USER (Soft Delete)
// ==============================

const deleteUser = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    )

    if (!user) {
      throw new Error('User not found')
    }

    return { message: 'User deleted successfully' }
  } catch (error) {
    throw error
  }
}

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}
