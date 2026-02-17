// =======================================================
// DATABASE CONNECTION - Kết nối MongoDB với Mongoose
// =======================================================

import mongoose from 'mongoose'
import { env } from '~/config/environment'

// Hàm kết nối database
const connectDatabase = async (): Promise<void> => {
  try {
    // Kiểm tra biến môi trường
    if (!env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env')
    }

    // Kết nối MongoDB
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })

    console.log('MongoDB connected successfully!')
    console.log(`Database: ${mongoose.connection.name}`)

    // Lắng nghe lỗi trong quá trình hoạt động
    mongoose.connection.on('error', (err: Error) => {
      console.error('MongoDB connection error:', err)
    })

    // Lắng nghe khi mất kết nối
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })

  } catch (error) {
    const err = error as Error
    console.error('MongoDB connection failed!', err.message)

    process.exit(1)
  }
}

export default connectDatabase
