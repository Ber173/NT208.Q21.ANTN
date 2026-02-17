// =======================================================
// AUTH ROUTES - Định nghĩa các API endpoints cho Authentication
// =======================================================
// File này định nghĩa các route (endpoint) liên quan đến authentication
// Mỗi route sẽ:
// 1. Chỉ định HTTP method (GET, POST, PUT, DELETE)
// 2. Chỉ định đường dẫn (path)
// 3. Áp dụng middleware (nếu cần)
// 4. Gọi controller function tương ứng

import express from 'express'
import authController from '~/controllers/auth.controller.js'
import { protect } from '~/middlewares/auth.middleware.js'

const router = express.Router()

// =======================================================
// PUBLIC ROUTES - Không cần authentication
// =======================================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Đăng ký user mới
 * @access  Public (ai cũng truy cập được)
 * Request body:
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 */
router.post('/register', authController.register)


/**
 * @route   POST /api/v1/auth/login
 * @desc    Đăng nhập
 * @access  Public
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "123456"
 * }
 * Response:
 * {
 *   "success": true,
 *   "message": "Login successful",
 *   "data": {
 *     "user": { ...user info... },
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 * Client sau khi nhận được token phải:
 * 1. Lưu token vào localStorage: localStorage.setItem('token', data.token)
 * 2. Hoặc lưu vào cookie (nếu dùng httpOnly cookie)
 * 3. Gửi token trong header của mọi request tiếp theo:
 *    headers: { 'Authorization': 'Bearer ' + token }
 */
router.post('/login', authController.login)


/**
 * @route   POST /api/v1/auth/logout
 * @desc    Đăng xuất
 * @access  Public
 * LƯU Ý: Với JWT, logout chủ yếu xảy ra ở client
 * Client chỉ cần xóa token: localStorage.removeItem('token')
 * Endpoint này chỉ để xác nhận
 */
router.post('/logout', authController.logout)


// =======================================================
// PROTECTED ROUTES - Yêu cầu authentication
// =======================================================

/**
 * @route   GET /api/v1/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private (cần token)
 * Middleware 'protect' sẽ:
 * 1. Kiểm tra token trong header Authorization
 * 2. Verify token
 * 3. Lấy user từ database
 * 4. Gắn user vào req.user
 * 5. Nếu ok → chuyển sang controller
 * 6. Nếu lỗi → trả về 401 Unauthorized
 * Request headers:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "username": "john_doe",
 *     "email": "john@example.com",
 *     "points": 100
 *   }
 * }
 */
router.get('/me', protect, authController.getMe)


/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Cập nhật thông tin profile
 * @access  Private (cần token)
 * Request headers:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * Request body (chỉ gửi field cần update):
 * {
 *   "username": "new_username",
 *   "email": "newemail@example.com"
 * }
 * LƯU Ý: Không thể update password qua route này
 * Để đổi password, dùng route /change-password
 */
router.put('/profile', protect, authController.updateProfile)


/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Đổi password
 * @access  Private (cần token)
 * Request headers:
 * {
 *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 * Request body:
 * {
 *   "currentPassword": "old_password",
 *   "newPassword": "new_password"
 * }
 * Yêu cầu:
 * - currentPassword phải đúng
 * - newPassword phải ít nhất 6 ký tự
 */
router.put('/change-password', protect, authController.changePassword)


// Export router
export default router


// =======================================================
// HƯỚNG DẪN SỬ DỤNG API AUTHENTICATION
// =======================================================

/*

1. ĐĂNG KÝ USER MỚI
-------------------
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "points": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

→ Lưu token vào localStorage


2. ĐĂNG NHẬP
------------
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "123456"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}

→ Lưu token vào localStorage


3. LẤY THÔNG TIN USER HIỆN TẠI
-------------------------------
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "points": 100
  }
}


4. CẬP NHẬT PROFILE
-------------------
PUT /api/v1/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "username": "john_updated"
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ...updated user... }
}


5. ĐỔI PASSWORD
---------------
PUT /api/v1/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "new_password"
}

Response:
{
  "success": true,
  "message": "Password changed successfully"
}


6. ĐĂNG XUẤT
------------
POST /api/v1/auth/logout

→ Client xóa token: localStorage.removeItem('token')


=======================================================
CÁCH GỬI TOKEN TRONG REQUEST (CLIENT SIDE)
=======================================================

JavaScript/Fetch:
-----------------
const token = localStorage.getItem('token')

fetch('http://localhost:8017/api/v1/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})


Axios:
------
const token = localStorage.getItem('token')

axios.get('http://localhost:8017/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})


Hoặc setup axios default header:
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`


=======================================================
TEST API BẰNG POSTMAN/THUNDER CLIENT
=======================================================

1. Test Register:
   - Method: POST
   - URL: http://localhost:8017/api/v1/auth/register
   - Body → raw → JSON:
     {
       "username": "testuser",
       "email": "test@example.com",
       "password": "123456"
     }
   - Send
   - Copy token từ response

2. Test Get Me:
   - Method: GET
   - URL: http://localhost:8017/api/v1/auth/me
   - Headers:
     - Key: Authorization
     - Value: Bearer [paste token vào đây]
   - Send

*/
