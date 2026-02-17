/* eslint-disable no-useless-catch */
import User from '~/models/user.model.js'

const createUser = async (data) => {
  try {
    // Check if user already exists
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

const getAllUsers = async (query = {}) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = query
    
    const users = await User.find({ isActive: true })
      .select('-password')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const count = await User.countDocuments({ isActive: true })

    return {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    }
  } catch (error) {
    throw error
  }
}

const getUserById = async (id) => {
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

const updateUser = async (id, data) => {
  try {
    // Don't allow password update through this method
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

const deleteUser = async (id) => {
  try {
    // Soft delete - just mark as inactive
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
