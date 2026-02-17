# 🔐 HỆ THỐNG AUTHENTICATION - TÀI LIỆU CHI TIẾT

## 📋 Mục lục
1. [Tổng quan](#tổng-quan)
2. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
3. [Flow hoạt động](#flow-hoạt-động)
4. [API Endpoints](#api-endpoints)
5. [Cách test API](#cách-test-api)
6. [Code examples](#code-examples)

---

## 🎯 Tổng quan

Hệ thống Authentication đã được xây dựng hoàn chỉnh với:
- ✅ Đăng ký user mới (Register)
- ✅ Đăng nhập (Login)
- ✅ Lấy thông tin user hiện tại (Get Me)
- ✅ Cập nhật profile
- ✅ Đổi password
- ✅ JWT Token authentication
- ✅ Password hashing với bcrypt
- ✅ Error handling đầy đủ

---

## 📁 Cấu trúc thư mục

```
src/
├── config/
│   ├── environment.js          # Cấu hình environment variables (thêm JWT_SECRET, JWT_EXPIRE)
│   └── database.js             # Kết nối MongoDB
│
├── models/
│   └── user.model.js           # User schema với bcrypt hashing
│
├── controllers/
│   └── auth.controller.js      # Xử lý HTTP requests cho auth
│
├── services/
│   └── auth.service.js         # Business logic cho authentication
│
├── middlewares/
│   └── auth.middleware.js      # JWT verification middleware
│
└── routes/
    └── v1/
        ├── index.js            # Tổng hợp routes v1
        └── auth.route.js       # Định nghĩa auth endpoints

.env                            # Environment variables (thêm JWT_SECRET, JWT_EXPIRE)
```

---

## 🔄 Flow hoạt động

### 1️⃣ **FLOW ĐĂNG KÝ (Register)**

```
Client gửi request → auth.route.js → auth.controller.js → auth.service.js → user.model.js → MongoDB
                                                                ↓
Client nhận response ← password tự động hash bởi bcrypt hook ←┘
```

**Chi tiết từng bước:**

1. **Client gửi request:**
   ```
   POST /api/v1/auth/register
   Body: { username, email, password }
   ```

2. **Route** (`auth.route.js`):
   - Nhận request
   - Chuyển đến controller

3. **Controller** (`auth.controller.js`):
   - Lấy dữ liệu từ req.body
   - Gọi service.register()

4. **Service** (`auth.service.js`):
   - Validate dữ liệu
   - Kiểm tra email/username đã tồn tại chưa
   - Gọi User.create() để tạo user mới

5. **Model** (`user.model.js`):
   - Pre-save hook tự động hash password bằng bcrypt
   - Lưu user vào MongoDB

6. **Service tiếp:**
   - Tạo JWT token với user._id
   - Trả về { user, token }

7. **Controller:**
   - Trả response về client với status 201

8. **Client:**
   - Nhận response
   - Lưu token vào localStorage
   - Redirect đến trang chủ

---

### 2️⃣ **FLOW ĐĂNG NHẬP (Login)**

```
Client gửi email + password → Route → Controller → Service → Model (tìm user) → bcrypt.compare()
                                                                                        ↓
Client nhận token ←─── Controller ←─── Service tạo JWT token ←────────────────────────┘
```

**Chi tiết từng bước:**

1. **Client gửi request:**
   ```
   POST /api/v1/auth/login
   Body: { email, password }
   ```

2. **Service** (`auth.service.js`):
   - Tìm user theo email: `User.findOne({ email }).select('+password')`
   - **Tại sao cần `.select('+password')`?**
     - Trong model, password có `select: false`
     - Mặc định password không được trả về
     - Phải explicitly select để lấy password cho việc so sánh

3. **So sánh password:**
   ```javascript
   const isPasswordCorrect = await user.comparePassword(password)
   ```
   - `comparePassword()` là method trong user model
   - Sử dụng `bcrypt.compare(plainPassword, hashedPassword)`
   - Trả về `true` nếu đúng, `false` nếu sai

4. **Nếu password đúng:**
   - Tạo JWT token: `jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })`
   - Token chứa:
     ```javascript
     {
       id: "507f1f77bcf86cd799439011",  // User ID
       iat: 1516239022,                  // Issued at (thời điểm tạo)
       exp: 1516325422                   // Expiration (thời điểm hết hạn)
     }
     ```

5. **Trả về client:**
   ```json
   {
     "success": true,
     "message": "Login successful",
     "data": {
       "user": { ...user info... },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ```

6. **Client:**
   - Lưu token: `localStorage.setItem('token', data.token)`

---

### 3️⃣ **FLOW XÁC THỰC JWT (Protected Routes)**

```
Client gửi request + token → auth.middleware.js (protect) → verify token → lấy user → controller
                                      ↓                                                    ↓
                              401 Unauthorized                                   Trả dữ liệu về client
```

**Chi tiết từng bước:**

1. **Client gửi request với token:**
   ```
   GET /api/v1/auth/me
   Headers: {
     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ```

2. **Middleware `protect`** (`auth.middleware.js`):
   
   **Bước 2.1: Lấy token từ header**
   ```javascript
   const authHeader = req.headers.authorization
   // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   
   const token = authHeader.split(' ')[1]
   // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

   **Bước 2.2: Verify token**
   ```javascript
   const decoded = jwt.verify(token, JWT_SECRET)
   // Nếu token không hợp lệ → throw error
   // Nếu token hết hạn → throw TokenExpiredError
   // Nếu ok → trả về payload: { id: "...", iat: ..., exp: ... }
   ```

   **Bước 2.3: Lấy user từ database**
   ```javascript
   const user = await User.findById(decoded.id).select('-password')
   // Tìm user theo ID trong token
   // Không lấy password
   ```

   **Bước 2.4: Kiểm tra user**
   - User có tồn tại không?
   - User có bị deactivated không?

   **Bước 2.5: Gắn user vào request**
   ```javascript
   req.user = user
   next() // Chuyển sang controller tiếp theo
   ```

3. **Controller:**
   - Có thể truy cập `req.user` để biết user hiện tại
   - Xử lý logic và trả response

---

## 📚 API Endpoints

### 1. Đăng ký (Register)

**Endpoint:** `POST /api/v1/auth/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "points": 0,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MzI1NDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered. Please use another email or login."
}
```

---

### 2. Đăng nhập (Login)

**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "john_doe",
      "email": "john@example.com",
      "points": 100,
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Lấy thông tin user hiện tại

**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "points": 100,
    "isActive": true
  }
}
```

---

### 4. Cập nhật profile

**Endpoint:** `PUT /api/v1/auth/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```json
{
  "username": "john_updated"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_updated",
    "email": "john@example.com",
    "points": 100
  }
}
```

---

### 5. Đổi password

**Endpoint:** `PUT /api/v1/auth/change-password`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```json
{
  "currentPassword": "123456",
  "newPassword": "newpass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 🧪 Cách test API

### Sử dụng Thunder Client / Postman

#### 1. Test Register

1. Method: **POST**
2. URL: `http://localhost:8017/api/v1/auth/register`
3. Headers:
   ```
   Content-Type: application/json
   ```
4. Body (raw JSON):
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "123456"
   }
   ```
5. Click **Send**
6. **Copy token** từ response

---

#### 2. Test Login

1. Method: **POST**
2. URL: `http://localhost:8017/api/v1/auth/login`
3. Body:
   ```json
   {
     "email": "test@example.com",
     "password": "123456"
   }
   ```
4. Click **Send**
5. **Copy token** từ response

---

#### 3. Test Get Me (Protected Route)

1. Method: **GET**
2. URL: `http://localhost:8017/api/v1/auth/me`
3. Headers:
   ```
   Authorization: Bearer [PASTE_TOKEN_HERE]
   ```
4. Click **Send**

**Lưu ý:** Phải paste token vào sau từ "Bearer " (có khoảng trắng)

---

## 💻 Code Examples - Client Side

### JavaScript (Fetch API)

#### Đăng ký:
```javascript
async function register(username, email, password) {
  try {
    const response = await fetch('http://localhost:8017/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Lưu token
      localStorage.setItem('token', data.data.token)
      console.log('Registered successfully!')
      // Redirect đến trang chủ
      window.location.href = '/dashboard'
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

#### Đăng nhập:
```javascript
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:8017/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (data.success) {
      // Lưu token
      localStorage.setItem('token', data.data.token)
      console.log('Login successful!')
      window.location.href = '/dashboard'
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

#### Lấy thông tin user:
```javascript
async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('No token found')
      return
    }
    
    const response = await fetch('http://localhost:8017/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('Current user:', data.data)
      return data.data
    } else {
      // Token không hợp lệ hoặc hết hạn
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
  } catch (error) {
    console.error('Error:', error)
  }
}
```

#### Đăng xuất:
```javascript
function logout() {
  // Xóa token khỏi localStorage
  localStorage.removeItem('token')
  
  // Redirect về trang login
  window.location.href = '/login'
}
```

---

### Axios

#### Setup axios với token tự động:
```javascript
import axios from 'axios'

// Tạo axios instance
const api = axios.create({
  baseURL: 'http://localhost:8017/api/v1'
})

// Interceptor: Tự động gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor: Xử lý lỗi 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

#### Sử dụng:
```javascript
import api from './api'

// Đăng ký
async function register(username, email, password) {
  const response = await api.post('/auth/register', {
    username,
    email,
    password
  })
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Đăng nhập
async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token)
  }
  
  return response.data
}

// Lấy thông tin user (token tự động được gắn bởi interceptor)
async function getMe() {
  const response = await api.get('/auth/me')
  return response.data
}
```

---

## 🔐 Giải thích JWT Token

### Token có dạng gì?
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MzI1NDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Token gồm 3 phần (ngăn cách bởi dấu chấm):

1. **Header** (màu đỏ):
   ```json
   {
     "alg": "HS256",
     "typ": "JWT"
   }
   ```

2. **Payload** (màu xanh):
   ```json
   {
     "id": "507f1f77bcf86cd799439011",
     "iat": 1516239022,
     "exp": 1516325422
   }
   ```

3. **Signature** (màu tím):
   - Chữ ký được tạo bằng cách mã hóa header + payload + secret key
   - Đảm bảo token không bị giả mạo

### Tại sao JWT an toàn?

1. **Không thể giả mạo:**
   - Nếu ai đó sửa payload
   - Signature sẽ không khớp
   - Server sẽ reject

2. **Có thời hạn:**
   - Token có `exp` (expiration time)
   - Sau thời gian này, token không còn hợp lệ

3. **Stateless:**
   - Server không cần lưu token
   - Chỉ cần verify signature

---

## 🛡️ Bảo mật

### ✅ Đã implement:
- ✅ Password được hash bằng bcrypt (salt 10 rounds)
- ✅ Password không bao giờ được trả về trong response
- ✅ JWT token có thời hạn
- ✅ Validate email format
- ✅ Validate password length (tối thiểu 6 ký tự)
- ✅ Check user isActive trước khi cho login
- ✅ Soft delete user (không xóa vĩnh viễn)

### 🔒 Nên làm thêm (Production):
- [ ] Rate limiting (giới hạn số request)
- [ ] Refresh token (token tự động gia hạn)
- [ ] Token blacklist (thu hồi token khi logout)
- [ ] Email verification (xác thực email)
- [ ] Password reset (quên mật khẩu)
- [ ] 2FA (Two-factor authentication)
- [ ] HTTPS only
- [ ] CORS whitelist cụ thể

---

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. MongoDB có đang chạy không?
2. Port 8017 có bị chiếm không?
3. JWT_SECRET trong .env đã được set chưa?
4. Token có được gửi đúng format không? (`Bearer <token>`)

---

**🎉 Chúc bạn code vui vẻ!**
