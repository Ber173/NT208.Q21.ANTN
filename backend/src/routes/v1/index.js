// =======================================================
// ROUTES V1 INDEX - Tổng hợp tất cả routes version 1
// =======================================================
// File này import và tổ chức tất cả các route modules
// Mỗi route module sẽ có prefix riêng
// Ví dụ:
// - /api/v1/auth/...  → auth routes
// - /api/v1/users/... → user routes

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import authRoutes from '~/routes/v1/auth.route.js'
import userRoutes from '~/routes/v1/user.route.js'

const router = express.Router()

// =======================================================
// API STATUS CHECK
// =======================================================
// Route này dùng để kiểm tra API có hoạt động không
// GET /api/v1/status

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'API V1 is working',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})


// =======================================================
// API ROUTES
// =======================================================

// Authentication routes
// Prefix: /api/v1/auth
// Ví dụ:
// - POST /api/v1/auth/register
// - POST /api/v1/auth/login
// - GET  /api/v1/auth/me
router.use('/auth', authRoutes)

// User routes
// Prefix: /api/v1/users
// Ví dụ:
// - GET    /api/v1/users
// - GET    /api/v1/users/:id
// - POST   /api/v1/users
// - PUT    /api/v1/users/:id
// - DELETE /api/v1/users/:id
router.use('/users', userRoutes)


// =======================================================
// HƯỚNG DẪN THÊM ROUTE MODULE MỚI
// =======================================================
/*

Khi cần thêm module mới (ví dụ: vocabulary), làm theo các bước:

1. Tạo file route: src/routes/v1/vocabulary.route.js
2. Import vào file này: import vocabularyRoutes from '~/routes/v1/vocabulary.route.js'
3. Use với prefix: router.use('/vocabulary', vocabularyRoutes)

Kết quả: /api/v1/vocabulary/...

*/


export default router