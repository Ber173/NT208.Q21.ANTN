// =======================================================
// CORS CONFIGURATION - Cấu hình CORS cho Express server
// =======================================================

import { CorsOptions } from 'cors'
import { env } from '~/config/environment'

// Danh sách domain được phép truy cập trong production
const whitelist: string[] = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8017'
  // Thêm domain production của bạn vào đây
]

// Cấu hình CORS
export const corsOptions: CorsOptions = {
  // Kiểm tra origin của request
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {

    // Nếu request không có origin (Postman, mobile app, server-to-server)
    if (!origin) return callback(null, true)

    // Nếu đang ở môi trường development → cho phép tất cả
    if (env.NODE_ENV === 'development') {
      return callback(null, true)
    }

    // Nếu ở production → kiểm tra whitelist
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  // Cho phép gửi cookie / Authorization header
  credentials: true,

  // Fix cho IE cũ với preflight request
  optionsSuccessStatus: 200
}
