# 📘 Hướng Dẫn Kết Nối Frontend vào Backend

## 🎯 Tổng Quan

Backend này là REST API cho website học tiếng Anh, được xây dựng với:
- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** (Mongoose ORM)
- **JWT Authentication**
- **CORS** enabled

---

## 🚀 Bước 1: Khởi Động Backend

### 1.1. Cài Đặt Dependencies

```bash
npm install
```

### 1.2. Cấu Hình File `.env`

Tạo file `.env` trong thư mục root với nội dung:

```env
# Server Configuration
NODE_ENV=development
APP_HOST=localhost
APP_PORT=8017

# Database Configuration
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=english-learning

# JWT Authentication
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

### 1.3. Chạy Backend

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

Backend sẽ chạy tại: `http://localhost:8017`

---

## 🔌 Bước 2: Kết Nối Từ Frontend

### 2.1. URL Base API

```javascript
const API_BASE_URL = 'http://localhost:8017/api/v1'
```

### 2.2. Cấu Hình CORS

Backend đã được cấu hình CORS để cho phép các domain sau (trong development):
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8017`

**Lưu ý:** Trong production, cần thêm domain frontend vào whitelist trong file [`src/config/cors.ts`](src/config/cors.ts)

---

## 📡 Bước 3: Các API Endpoints Có Sẵn

### 3.1. Health Check

```http
GET /
GET /api/v1/status
```

**Response:**
```json
{
  "success": true,
  "message": "API V1 is working",
  "version": "1.0.0"
}
```

### 3.2. Authentication Endpoints

| Method | Endpoint | Mô tả | Authentication |
|--------|----------|-------|----------------|
| POST | `/api/v1/auth/register` | Đăng ký tài khoản mới | Không |
| POST | `/api/v1/auth/login` | Đăng nhập | Không |
| POST | `/api/v1/auth/logout` | Đăng xuất | Không |
| GET | `/api/v1/auth/me` | Lấy thông tin user hiện tại | **Có** |
| PUT | `/api/v1/auth/profile` | Cập nhật profile | **Có** |
| PUT | `/api/v1/auth/change-password` | Đổi mật khẩu | **Có** |

### 3.3. User Management Endpoints

| Method | Endpoint | Mô tả | Authentication |
|--------|----------|-------|----------------|
| POST | `/api/v1/users` | Tạo user mới | Cần kiểm tra |
| GET | `/api/v1/users` | Lấy danh sách users | Cần kiểm tra |
| GET | `/api/v1/users/:id` | Lấy thông tin user theo ID | Cần kiểm tra |
| PUT | `/api/v1/users/:id` | Cập nhật user | Cần kiểm tra |
| DELETE | `/api/v1/users/:id` | Xóa user | Cần kiểm tra |

---

## 💻 Bước 4: Ví Dụ Code Integration

### 4.1. Sử Dụng Fetch API (Vanilla JS)

#### Đăng Ký User

```javascript
async function register(userData) {
  try {
    const response = await fetch('http://localhost:8017/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Đăng ký thành công:', data);
      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.message || 'Đăng ký thất bại');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### Đăng Nhập

```javascript
async function login(credentials) {
  try {
    const response = await fetch('http://localhost:8017/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Đăng nhập thành công:', data);
      // Lưu token vào localStorage
      localStorage.setItem('token', data.token);
      return data;
    } else {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

#### Lấy Thông Tin User (Protected Route)

```javascript
async function getMyProfile() {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    const response = await fetch('http://localhost:8017/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Thông tin user:', data);
      return data;
    } else {
      throw new Error(data.message || 'Lấy thông tin thất bại');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

### 4.2. Sử Dụng Axios (Recommended)

#### Cài Đặt Axios

```bash
npm install axios
```

#### Tạo API Service (React/Vue/Angular)

```javascript
// src/services/api.service.js
import axios from 'axios';

// Tạo axios instance với config sẵn
const apiClient = axios.create({
  baseURL: 'http://localhost:8017/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor để tự động thêm token vào mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và error
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 (Unauthorized) - token hết hạn
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
```

#### Tạo Auth Service

```javascript
// src/services/auth.service.js
import apiClient from './api.service';

export const authService = {
  // Đăng ký
  register: async (userData) => {
    const data = await apiClient.post('/auth/register', userData);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  // Đăng nhập
  login: async (credentials) => {
    const data = await apiClient.post('/auth/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  // Đăng xuất
  logout: async () => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
  },

  // Lấy thông tin user hiện tại
  getMe: async () => {
    return await apiClient.get('/auth/me');
  },

  // Cập nhật profile
  updateProfile: async (profileData) => {
    return await apiClient.put('/auth/profile', profileData);
  },

  // Đổi mật khẩu
  changePassword: async (passwordData) => {
    return await apiClient.put('/auth/change-password', passwordData);
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Lấy token
  getToken: () => {
    return localStorage.getItem('token');
  }
};
```

#### Sử Dụng Trong Component (React Example)

```jsx
// LoginComponent.jsx
import React, { useState } from 'react';
import { authService } from '../services/auth.service';

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      console.log('Đăng nhập thành công:', data);
      
      // Redirect hoặc update UI
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Đăng Nhập</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
}

export default LoginComponent;
```

---

### 4.3. Sử Dụng Trong Vue.js

```javascript
// Vue 3 Composition API Example
<script setup>
import { ref } from 'vue';
import { authService } from '@/services/auth.service';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    const data = await authService.login({
      email: email.value,
      password: password.value
    });
    
    console.log('Đăng nhập thành công:', data);
    // Redirect
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleLogin">
    <h2>Đăng Nhập</h2>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      required
    />
    
    <input
      v-model="password"
      type="password"
      placeholder="Mật khẩu"
      required
    />
    
    <button type="submit" :disabled="loading">
      {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
    </button>
  </form>
</template>
```

---

## 🔐 Bước 5: Xử Lý Authentication

### 5.1. Luồng Authentication

1. **Đăng ký/Đăng nhập** → Nhận token từ backend
2. **Lưu token** vào `localStorage` hoặc `sessionStorage`
3. **Gửi token** trong header `Authorization: Bearer <token>` cho các protected routes
4. **Xử lý token hết hạn** → Redirect về trang login

### 5.2. Protected Routes trong Frontend

#### React Router Example

```jsx
// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

export default ProtectedRoute;

// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Vue Router Example

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { authService } from '@/services/auth.service';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfilePage.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = authService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```

---

## 🌍 Bước 6: Deploy và Production

### 6.1. Cập Nhật CORS cho Production

Trong file [`src/config/cors.ts`](src/config/cors.ts), thêm domain production của frontend:

```typescript
const whitelist: string[] = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-frontend-domain.com',  // ← Thêm domain production
  'https://www.your-frontend-domain.com'
]
```

### 6.2. Cập Nhật API Base URL

```javascript
// config.js hoặc .env trong frontend
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-domain.com/api/v1'
  : 'http://localhost:8017/api/v1';
```

---

## 🐛 Troubleshooting

### Lỗi CORS

**Hiện tượng:** Console hiển thị lỗi CORS
```
Access to fetch at 'http://localhost:8017/api/v1/auth/login' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Giải pháp:**
1. Kiểm tra frontend đang chạy ở port nào
2. Thêm port đó vào whitelist trong [`src/config/cors.ts`](src/config/cors.ts)
3. Restart backend

### Token không được gửi

**Hiện tượng:** Protected routes trả về 401 Unauthorized

**Giải pháp:**
1. Kiểm tra token đã được lưu trong localStorage chưa
2. Kiểm tra format header: `Authorization: Bearer <token>`
3. Kiểm tra token còn hạn không (mặc định 7 ngày)

### Connection Refused

**Hiện tượng:** Frontend không kết nối được backend

**Giải pháp:**
1. Kiểm tra backend có đang chạy không
2. Kiểm tra port có đúng không (default: 8017)
3. Kiểm tra firewall có block không

---

## 📚 Tài Liệu Tham Khảo

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [Axios Documentation](https://axios-http.com/)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề khi kết nối frontend vào backend, vui lòng:
1. Kiểm tra lại từng bước trong hướng dẫn
2. Xem log trong console của browser
3. Xem log của backend server
4. Liên hệ team development

---

**Good luck! 🚀**
