// =======================================================
// AUTH MIDDLEWARE - Xác thực người dùng qua JWT Token
// =======================================================
// File này chứa middleware để bảo vệ các route cần authentication
// Middleware sẽ:
// 1. Kiểm tra xem có JWT token trong request header không
// 2. Verify token có hợp lệ không
// 3. Lấy thông tin user từ token và gắn vào req.user
// 4. Cho phép request đi tiếp nếu hợp lệ, hoặc trả về lỗi 401 nếu không

import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment.js'
import User from '~/models/user.model.js'

/**
 * Middleware xác thực JWT Token
 * 
 * Cách sử dụng:
 * import { protect } from '~/middlewares/auth.middleware.js'
 * router.get('/profile', protect, getUserProfile)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const protect = async (req, res, next) => {
  try {
    // =======================
    // BƯỚC 1: Lấy token từ header
    // =======================
    
    // Token thường được gửi trong header Authorization với format: "Bearer <token>"
    let token
    
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Tách lấy token từ chuỗi "Bearer <token>"
      // split(' ') sẽ tạo mảng ['Bearer', '<token>']
      // [1] sẽ lấy phần tử thứ 2 (token)
      token = req.headers.authorization.split(' ')[1]
    }

    // =======================
    // BƯỚC 2: Kiểm tra token có tồn tại không
    // =======================
    
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Not authorized to access this route. Please login first.'
      })
    }

    // =======================
    // BƯỚC 3: Verify token
    // =======================
    
    try {
      // jwt.verify() sẽ:
      // - Giải mã token
      // - Kiểm tra chữ ký (signature) có đúng không
      // - Kiểm tra token đã hết hạn chưa
      // - Trả về payload (dữ liệu) đã mã hóa trong token
      const decoded = jwt.verify(token, env.JWT_SECRET)
      
      // decoded sẽ có dạng:
      // {
      //   id: '507f1f77bcf86cd799439011',  // ID của user
      //   iat: 1516239022,                  // Issued at (thời điểm tạo)
      //   exp: 1516325422                   // Expiration (thời điểm hết hạn)
      // }

      // =======================
      // BƯỚC 4: Lấy thông tin user từ database
      // =======================
      
      // Tìm user trong database dựa trên ID trong token
      // .select('-password') để không lấy password
      const user = await User.findById(decoded.id).select('-password')
      
      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'User not found. Token is invalid.'
        })
      }

      // Kiểm tra user có bị vô hiệu hóa không
      if (!user.isActive) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Your account has been deactivated. Please contact support.'
        })
      }

      // =======================
      // BƯỚC 5: Gắn user vào request object
      // =======================
      
      // Gắn thông tin user vào req.user để các controller sau có thể sử dụng
      // Sau này trong controller có thể dùng: req.user để lấy thông tin user hiện tại
      req.user = user
      
      // Gọi next() để chuyển sang middleware/controller tiếp theo
      next()
      
    } catch (error) {
      // Token không hợp lệ hoặc đã hết hạn
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Invalid token. Please login again.'
        })
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Your token has expired. Please login again.'
        })
      }
      
      throw error
    }
    
  } catch (error) {
    // Lỗi không mong đợi
    console.error('Auth middleware error:', error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}


/**
 * Middleware kiểm tra quyền admin (optional - nếu cần)
 * 
 * Sử dụng sau middleware protect:
 * router.delete('/users/:id', protect, isAdmin, deleteUser)
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const isAdmin = (req, res, next) => {
  // req.user đã được gắn bởi middleware protect ở trên
  
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
 * Middleware optional authentication (không bắt buộc)
 * 
 * Khác với protect, middleware này sẽ:
 * - Nếu có token hợp lệ → gắn user vào req.user
 * - Nếu không có token hoặc token không hợp lệ → vẫn cho qua (không trả lỗi)
 * 
 * Sử dụng cho các route mà:
 * - Guest có thể truy cập
 * - Nhưng nếu đã login thì có thêm thông tin/chức năng
 * 
 * Ví dụ: Xem danh sách từ vựng
 * - Guest xem được
 * - User đã login xem được + biết từ nào đã học
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token
    
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      // Không có token → Không sao, cho qua
      return next()
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')
      
      if (user && user.isActive) {
        req.user = user
      }
      
      next()
    } catch (error) {
      // Token không hợp lệ → Không sao, cho qua (không gắn user)
      next()
    }
    
  } catch (error) {
    next()
  }
}
