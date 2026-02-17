# 📋 HTTP STATUS CODES REFERENCE

## 🎯 Tại sao sử dụng thư viện `http-status-codes`?

Thay vì hardcode số như `200`, `201`, `404`, chúng ta sử dụng constants có tên rõ ràng:

```javascript
// ❌ Không tốt - Hardcoded
res.status(200).json({ ... })
res.status(401).json({ ... })

// ✅ Tốt hơn - Sử dụng constants
import { StatusCodes } from 'http-status-codes'

res.status(StatusCodes.OK).json({ ... })
res.status(StatusCodes.UNAUTHORIZED).json({ ... })
```

**Lợi ích:**
- ✅ Code dễ đọc, dễ hiểu hơn
- ✅ Tránh nhầm lẫn giữa các số (401 vs 403)
- ✅ IDE autocomplete giúp code nhanh hơn
- ✅ Dễ bảo trì và refactor

---

## 📊 CÁC STATUS CODES ĐANG SỬ DỤNG TRONG PROJECT

### ✅ **2xx - Success (Thành công)**

#### `StatusCodes.OK` (200)
**Sử dụng khi:** Request thành công, trả về dữ liệu

**Vị trí sử dụng:**
- ✓ `auth.controller.js`: login, getMe, updateProfile, changePassword, logout
- ✓ `user.controller.js`: getUsers, getUserById, updateUser, deleteUser
- ✓ `routes/v1/index.js`: API status check
- ✓ `server.js`: Health check endpoint

```javascript
// Ví dụ:
res.status(StatusCodes.OK).json({
  success: true,
  data: user
})
```

---

#### `StatusCodes.CREATED` (201)
**Sử dụng khi:** Tạo mới resource thành công

**Vị trí sử dụng:**
- ✓ `auth.controller.js`: register (đăng ký user mới)
- ✓ `user.controller.js`: createUser (tạo user)

```javascript
// Ví dụ:
res.status(StatusCodes.CREATED).json({
  success: true,
  message: 'User created successfully',
  data: newUser
})
```

---

### ❌ **4xx - Client Errors (Lỗi từ phía client)**

#### `StatusCodes.UNAUTHORIZED` (401)
**Sử dụng khi:** Chưa đăng nhập hoặc token không hợp lệ

**Vị trí sử dụng:**
- ✓ `auth.middleware.js`: protect, verify token

**Các trường hợp:**
- Không có token
- Token không hợp lệ
- Token đã hết hạn
- User không tồn tại
- Account bị vô hiệu hóa

```javascript
// Ví dụ:
return res.status(StatusCodes.UNAUTHORIZED).json({
  success: false,
  message: 'Not authorized to access this route. Please login first.'
})
```

---

#### `StatusCodes.FORBIDDEN` (403)
**Sử dụng khi:** Đã đăng nhập nhưng không có quyền truy cập

**Vị trí sử dụng:**
- ✓ `auth.middleware.js`: isAdmin (kiểm tra quyền admin)

**Khác biệt với 401:**
- **401 UNAUTHORIZED**: Chưa đăng nhập hoặc token không hợp lệ
- **403 FORBIDDEN**: Đã đăng nhập nhưng không đủ quyền

```javascript
// Ví dụ:
res.status(StatusCodes.FORBIDDEN).json({
  success: false,
  message: 'Not authorized as an admin'
})
```

---

#### `StatusCodes.NOT_FOUND` (404)
**Sử dụng khi:** Không tìm thấy route hoặc resource

**Vị trí sử dụng:**
- ✓ `server.js`: 404 handler (route không tồn tại)

```javascript
// Ví dụ:
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: 'Route not found'
  })
})
```

---

### 🔥 **5xx - Server Errors (Lỗi từ phía server)**

#### `StatusCodes.INTERNAL_SERVER_ERROR` (500)
**Sử dụng khi:** Lỗi không mong đợi từ server

**Vị trí sử dụng:**
- ✓ `server.js`: Error handling middleware
- ✓ `auth.middleware.js`: Catch unexpected errors

```javascript
// Ví dụ:
app.use((err, req, res, next) => {
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || 'Internal Server Error'
  })
})
```

---

## 🗺️ DANH SÁCH ĐẦY ĐỦ CÁC STATUS CODES THƯỜNG DÙNG

### **Success (2xx)**
```javascript
StatusCodes.OK                    // 200 - Thành công
StatusCodes.CREATED               // 201 - Tạo mới thành công
StatusCodes.ACCEPTED              // 202 - Đã nhận, đang xử lý
StatusCodes.NO_CONTENT            // 204 - Thành công, không trả dữ liệu
```

### **Client Errors (4xx)**
```javascript
StatusCodes.BAD_REQUEST           // 400 - Request sai format
StatusCodes.UNAUTHORIZED          // 401 - Chưa đăng nhập
StatusCodes.FORBIDDEN             // 403 - Không có quyền
StatusCodes.NOT_FOUND             // 404 - Không tìm thấy
StatusCodes.CONFLICT              // 409 - Conflict (ví dụ: email đã tồn tại)
StatusCodes.UNPROCESSABLE_ENTITY  // 422 - Validation error
StatusCodes.TOO_MANY_REQUESTS     // 429 - Rate limit exceeded
```

### **Server Errors (5xx)**
```javascript
StatusCodes.INTERNAL_SERVER_ERROR // 500 - Lỗi server
StatusCodes.NOT_IMPLEMENTED       // 501 - Chưa implement
StatusCodes.BAD_GATEWAY           // 502 - Bad gateway
StatusCodes.SERVICE_UNAVAILABLE   // 503 - Service không khả dụng
```

---

## 💡 KHI NÀO DÙNG STATUS CODE GÌ?

### **Đăng ký / Tạo mới**
```javascript
✅ 201 CREATED        // Tạo thành công
❌ 400 BAD_REQUEST    // Validation error
❌ 409 CONFLICT       // Email/Username đã tồn tại
```

### **Đăng nhập**
```javascript
✅ 200 OK             // Login thành công
❌ 401 UNAUTHORIZED   // Email/password sai
❌ 403 FORBIDDEN      // Account bị khóa
```

### **Lấy dữ liệu (GET)**
```javascript
✅ 200 OK             // Lấy thành công
❌ 401 UNAUTHORIZED   // Chưa login
❌ 404 NOT_FOUND      // Resource không tồn tại
```

### **Cập nhật (PUT/PATCH)**
```javascript
✅ 200 OK             // Cập nhật thành công
❌ 401 UNAUTHORIZED   // Chưa login
❌ 403 FORBIDDEN      // Không có quyền sửa
❌ 404 NOT_FOUND      // Resource không tồn tại
```

### **Xóa (DELETE)**
```javascript
✅ 200 OK             // Xóa thành công (trả về message)
✅ 204 NO_CONTENT     // Xóa thành công (không trả body)
❌ 401 UNAUTHORIZED   // Chưa login
❌ 403 FORBIDDEN      // Không có quyền xóa
❌ 404 NOT_FOUND      // Resource không tồn tại
```

---

## 🔧 CÁCH SỬ DỤNG TRONG CODE

### **Import**
```javascript
import { StatusCodes } from 'http-status-codes'
```

### **Trong Controller**
```javascript
// Success
res.status(StatusCodes.OK).json({ data })
res.status(StatusCodes.CREATED).json({ data })

// Client Errors
res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input' })
res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Please login' })
res.status(StatusCodes.FORBIDDEN).json({ message: 'No permission' })
res.status(StatusCodes.NOT_FOUND).json({ message: 'Not found' })

// Server Errors
res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' })
```

### **Trong Middleware**
```javascript
export const protect = async (req, res, next) => {
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized'
    })
  }
  // ...
}
```

### **Error Handling**
```javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  
  res.status(statusCode).json({
    success: false,
    message: err.message
  })
})
```

---

## 📚 TÀI LIỆU THAM KHẢO

- [MDN HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [http-status-codes NPM Package](https://www.npmjs.com/package/http-status-codes)
- [REST API Status Codes Guide](https://restfulapi.net/http-status-codes/)

---

## ✅ CHECKLIST KHI VIẾT API MỚI

- [ ] Import `StatusCodes` từ `http-status-codes`
- [ ] Sử dụng `StatusCodes.OK` thay vì `200`
- [ ] Sử dụng `StatusCodes.CREATED` cho tạo mới
- [ ] Sử dụng `StatusCodes.UNAUTHORIZED` cho lỗi auth
- [ ] Sử dụng `StatusCodes.NOT_FOUND` cho không tìm thấy
- [ ] Đảm bảo error handler sử dụng status code phù hợp
- [ ] Test tất cả các trường hợp: success, error, edge cases

---

**Cập nhật:** 17/02/2026  
**Version:** 1.0.0
