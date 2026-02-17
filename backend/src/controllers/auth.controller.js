// =======================================================
// AUTH CONTROLLER - Xử lý HTTP requests cho Authentication
// =======================================================
// File này chứa các controller functions để:
// - Nhận request từ client
// - Gọi service để xử lý logic
// - Trả response về client
//
// Controller không chứa business logic, chỉ xử lý request/response

import { StatusCodes } from 'http-status-codes'
import authService from '~/services/auth.service.js'

/**
 * ĐĂNG KÝ USER MỚI
 * Route: POST /api/v1/auth/register
 * 
 * Request body mẫu:
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 * 
 * Response mẫu (thành công):
 * {
 *   "success": true,
 *   "message": "User registered successfully",
 *   "data": {
 *     "user": {
 *       "_id": "507f1f77bcf86cd799439011",
 *       "username": "john_doe",
 *       "email": "john@example.com",
 *       "points": 0,
 *       "isActive": true,
 *       "createdAt": "2024-01-01T00:00:00.000Z",
 *       "updatedAt": "2024-01-01T00:00:00.000Z"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 * 
 * Response mẫu (lỗi):
 * {
 *   "success": false,
 *   "message": "Email already registered. Please use another email or login."
 * }
 */
const register = async (req, res, next) => {
  try {
    // =======================
    // BƯỚC 1: Lấy dữ liệu từ request body
    // =======================
    
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    }

    // =======================
    // BƯỚC 2: Gọi service để xử lý logic đăng ký
    // =======================
    
    const result = await authService.register(userData)

    // =======================
    // BƯỚC 3: Trả response về client
    // =======================
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: result
    })
    
  } catch (error) {
    // Nếu có lỗi, chuyển sang error handling middleware
    next(error)
  }
}


/**
 * ĐĂNG NHẬP
 * Route: POST /api/v1/auth/login
 * 
 * Request body mẫu:
 * {
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 * 
 * Response mẫu (thành công):
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": {
 *       "_id": "507f1f77bcf86cd799439011",
 *       "username": "john_doe",
 *       "email": "john@example.com",
 *       "points": 100,
 *       "isActive": true,
 *       "createdAt": "2024-01-01T00:00:00.000Z",
 *       "updatedAt": "2024-01-15T10:30:00.000Z"
 *     },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 * 
 * Response mẫu (lỗi):
 * {
 *   "success": false,
 *   "message": "Invalid email or password"
 * }
 * 
 * Sau khi đăng nhập thành công:
 * - Client lưu token vào localStorage hoặc cookie
 * - Các request tiếp theo gửi token trong header: Authorization: Bearer <token>
 */
const login = async (req, res, next) => {
  try {
    // =======================
    // BƯỚC 1: Lấy email và password từ request
    // =======================
    
    const loginData = {
      email: req.body.email,
      password: req.body.password
    }

    // =======================
    // BƯỚC 2: Gọi service để xử lý logic đăng nhập
    // =======================
    
    const result = await authService.login(loginData)

    // =======================
    // BƯỚC 3: Trả response về client
    // =======================
    
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
 * LẤY THÔNG TIN USER HIỆN TẠI
 * Route: GET /api/v1/auth/me
 * 
 * Route này được bảo vệ bởi middleware 'protect'
 * Client phải gửi token trong header:
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 * 
 * Request: Không cần body, chỉ cần token trong header
 * 
 * Response mẫu (thành công):
 * {
 *   "success": true,
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "username": "john_doe",
 *     "email": "john@example.com",
 *     "points": 150,
 *     "isActive": true,
 *     "createdAt": "2024-01-01T00:00:00.000Z",
 *     "updatedAt": "2024-01-20T15:45:00.000Z"
 *   }
 * }
 * 
 * Response mẫu (lỗi - không có token):
 * {
 *   "success": false,
 *   "message": "Not authorized to access this route. Please login first."
 * }
 * 
 * Response mẫu (lỗi - token hết hạn):
 * {
 *   "success": false,
 *   "message": "Your token has expired. Please login again."
 * }
 */
const getMe = async (req, res, next) => {
  try {
    // =======================
    // LƯU Ý: req.user đã được gắn bởi middleware 'protect'
    // =======================
    
    // Middleware protect đã:
    // 1. Verify token
    // 2. Lấy user từ database
    // 3. Gắn user vào req.user
    // Nên ở đây ta chỉ cần trả về req.user

    // =======================
    // BƯỚC 1: Lấy user ID từ req.user
    // =======================
    
    const userId = req.user._id

    // =======================
    // BƯỚC 2: Gọi service để lấy thông tin user (optional)
    // =======================
    
    // Nếu muốn lấy dữ liệu mới nhất từ database:
    const user = await authService.getCurrentUser(userId)
    
    // Hoặc đơn giản chỉ trả về req.user:
    // const user = req.user

    // =======================
    // BƯỚC 3: Trả response về client
    // =======================
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: user
    })
    
  } catch (error) {
    next(error)
  }
}


/**
 * CẬP NHẬT PROFILE
 * Route: PUT /api/v1/auth/profile
 * 
 * Route này được bảo vệ bởi middleware 'protect'
 * 
 * Request body mẫu:
 * {
 *   "username": "john_updated",
 *   "email": "john_new@example.com"
 * }
 * 
 * Response mẫu (thành công):
 * {
 *   "success": true,
 *   "message": "Profile updated successfully",
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "username": "john_updated",
 *     "email": "john_new@example.com",
 *     "points": 150,
 *     "updatedAt": "2024-01-20T16:00:00.000Z"
 *   }
 * }
 */
const updateProfile = async (req, res, next) => {
  try {
    // Lấy user ID từ token (đã được gắn bởi middleware)
    const userId = req.user._id
    
    // Lấy dữ liệu cần cập nhật
    const updateData = req.body

    // Gọi service để cập nhật
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
 * ĐỔI PASSWORD
 * Route: PUT /api/v1/auth/change-password
 * 
 * Route này được bảo vệ bởi middleware 'protect'
 * 
 * Request body mẫu:
 * {
 *   "currentPassword": "123456",
 *   "newPassword": "newpass123"
 * }
 * 
 * Response mẫu (thành công):
 * {
 *   "success": true,
 *   "message": "Password changed successfully"
 * }
 * 
 * Response mẫu (lỗi):
 * {
 *   "success": false,
 *   "message": "Current password is incorrect"
 * }
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id
    
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
 * ĐĂNG XUẤT (Logout)
 * Route: POST /api/v1/auth/logout
 * 
 * LƯU Ý: Với JWT, việc logout chủ yếu xảy ra ở phía client
 * Client chỉ cần xóa token khỏi localStorage/cookie
 * 
 * Endpoint này chỉ để trả về message xác nhận
 * 
 * Nếu muốn logout thực sự (server-side), cần implement:
 * - Token blacklist (lưu token bị thu hồi vào Redis/Database)
 * - Refresh token rotation
 * 
 * Response mẫu:
 * {
 *   "success": true,
 *   "message": "Logged out successfully"
 * }
 */
const logout = async (req, res, next) => {
  try {
    // Với JWT, client chỉ cần xóa token
    // Server không cần làm gì đặc biệt
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged out successfully. Please remove your token from client.'
    })
    
  } catch (error) {
    next(error)
  }
}


// Export tất cả các controller functions
export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  logout
}
