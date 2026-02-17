// Import thư viện express để tạo server
import express from 'express'

// Import StatusCodes cho các HTTP status codes chuẩn
import { StatusCodes } from 'http-status-codes'

// Import biến môi trường (PORT, HOST, NODE_ENV,...)
import { env } from '~/config/environment.js'

// Import cấu hình CORS đã định nghĩa trước đó
import { corsOptions } from '~/config/cors.js'

// Import middleware cors
import cors from 'cors'

// Import hàm kết nối database MongoDB
import connectDatabase from '~/config/database.js'

// Import router version 1 (tổ chức API theo version)
import routesV1 from '~/routes/v1/index.js'


// =======================
// Hàm khởi động server
// =======================
const START_SERVER = () => {

  // Tạo instance ứng dụng Express
  const app = express()

  // =======================
  // Middleware
  // =======================

  // Cho phép CORS (cross-origin requests)
  app.use(cors(corsOptions))

  // Cho phép server đọc JSON từ request body
  app.use(express.json())

  // Cho phép đọc dữ liệu dạng form (application/x-www-form-urlencoded)
  app.use(express.urlencoded({ extended: true }))


  // =======================
  // API Routes
  // =======================

  // Tất cả route v1 sẽ có prefix /api/v1
  // Ví dụ: /api/v1/users
  app.use('/api/v1', routesV1)


  // =======================
  // Health check endpoint
  // =======================

  // Route gốc dùng để kiểm tra server có hoạt động không
  app.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'English Learning API is running!',
      version: '1.0.0',
      status: 'active'
    })
  })


  // =======================
  // Error handling middleware
  // =======================

  // Middleware bắt lỗi toàn cục
  // Phải đặt sau tất cả route
  app.use((err, req, res, next) => {
    console.error('Error:', err.stack)

    res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message || 'Internal Server Error',

      // Nếu đang ở môi trường development thì trả thêm stack để debug
      ...(env.NODE_ENV === 'development' && { stack: err.stack })
    })
  })


  // =======================
  // 404 handler
  // =======================

  // Nếu không route nào khớp → trả về 404
  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Route not found' })
  })


  // =======================
  // Start server
  // =======================

  // Server bắt đầu lắng nghe tại HOST và PORT
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at http://${env.APP_HOST}:${env.APP_PORT}/`)
    console.log(`Environment: ${env.NODE_ENV || 'development'}`)
  })
}


// ======================================================
// Kết nối database trước, sau đó mới khởi động server
// ======================================================

// IIFE (Immediately Invoked Function Expression)
// Hàm async tự chạy ngay khi file được load
;(async () => {
  try {

    // Chờ kết nối MongoDB thành công
    await connectDatabase()

    // Sau khi kết nối DB thành công thì mới start server
    START_SERVER()

  } catch (error) {

    // Nếu lỗi trong quá trình khởi động
    console.error('Failed to start server:', error)

    // Dừng toàn bộ ứng dụng
    process.exit(1)
  }
})()
