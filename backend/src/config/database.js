// Import thư viện mongoose để kết nối MongoDB
import mongoose from 'mongoose'

// Import biến môi trường (đã được cấu hình ở file environment.js)
import { env } from '~/config/environment.js'

// Hàm dùng để kết nối đến database
const connectDatabase = async () => {
  try {
    // Kiểm tra xem biến môi trường MONGODB_URI có tồn tại không
    // Nếu không có thì báo lỗi ngay từ đầu
    if (!env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env')
    }

    // Thực hiện kết nối đến MongoDB
    // serverSelectionTimeoutMS: thời gian tối đa chờ tìm server (5 giây)
    // socketTimeoutMS: thời gian tối đa cho một request qua socket (45 giây)
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })

    // Nếu kết nối thành công thì in ra thông báo
    console.log('MongoDB connected successfully!')

    // In ra tên database đang được sử dụng
    console.log(`Database: ${mongoose.connection.name}`)

    // Lắng nghe sự kiện lỗi trong quá trình kết nối
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })

    // Lắng nghe sự kiện khi bị mất kết nối
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })

  } catch (error) {
    // Nếu có lỗi xảy ra khi kết nối ban đầu
    console.error('MongoDB connection failed!', error.message)

    // Dừng toàn bộ ứng dụng (thường dùng khi không thể kết nối DB)
    process.exit(1)
  }
}

// Export hàm để có thể sử dụng ở file khác (ví dụ: server.js)
export default connectDatabase
