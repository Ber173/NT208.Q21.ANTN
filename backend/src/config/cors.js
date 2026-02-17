// Import biến môi trường (NODE_ENV, v.v.)
import { env } from '~/config/environment.js'

// Cấu hình CORS cho server (thường dùng với express + cors middleware)
export const corsOptions = {
  // Hàm kiểm tra origin của request có được phép truy cập hay không
  origin: function (origin, callback) {

    // Trường hợp request không có origin
    // Ví dụ: gọi từ Postman, mobile app, server-to-server request
    // => Cho phép luôn
    if (!origin) return callback(null, true)

    // Nếu đang ở môi trường development
    // => Cho phép tất cả origin (để dev cho tiện)
    if (env.NODE_ENV === 'development') {
      return callback(null, true)
    }

    // Nếu ở môi trường production
    // => Chỉ cho phép những domain nằm trong whitelist
    const whitelist = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8017'
      // Thêm domain production của bạn vào đây
    ]

    // Kiểm tra origin có nằm trong whitelist không
    if (whitelist.indexOf(origin) !== -1) {
      // Nếu có → cho phép
      callback(null, true)
    } else {
      // Nếu không → từ chối request vì vi phạm CORS
      callback(new Error('Not allowed by CORS'))
    }
  },

  // Cho phép gửi cookie / authorization header giữa client và server
  credentials: true,

  // Một số trình duyệt (IE cũ) cần status 200 thay vì 204 cho preflight request
  optionsSuccessStatus: 200
}
