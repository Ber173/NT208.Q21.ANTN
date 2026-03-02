# 📚 TÀI LIỆU DỰ ÁN - HỆ THỐNG HỌC TIẾNG ANH

> **Web to Learning English** - Backend API Service  
> **Version:** 1.0.0  
> **Authors:** NH and VP  
> **Date:** March 2, 2026

---

## 🎯 TỔNG QUAN DỰ ÁN

### Giới thiệu
Đây là một hệ thống backend API hoàn chỉnh cho ứng dụng học tiếng Anh, được xây dựng bằng **Node.js**, **Express**, **TypeScript** và **MongoDB**. Hệ thống cung cấp các tính năng học từ vựng thông qua quiz, theo dõi tiến độ học tập, hệ thống điểm thưởng, streak (chuỗi ngày học liên tục), và bảng xếp hạng.

### Công nghệ sử dụng
- **Runtime:** Node.js >= 18.x
- **Framework:** Express.js 4.18.2
- **Language:** TypeScript 5.3.0
- **Database:** MongoDB (Mongoose 9.2.1)
- **Authentication:** JWT (JSON Web Token)
- **Security:** bcryptjs (mã hóa mật khẩu)
- **CORS:** Hỗ trợ Cross-Origin Resource Sharing

### Mục tiêu dự án
- ✅ Cung cấp API cho việc học từ vựng tiếng Anh theo chủ đề
- ✅ Hệ thống quiz tự động chấm điểm
- ✅ Quản lý người dùng và xác thực an toàn
- ✅ Theo dõi tiến độ học tập và thống kê
- ✅ Hệ thống điểm thưởng và streak động viên người học
- ✅ Bảng xếp hạng khuyến khích cạnh tranh lành mạnh
- ✅ API RESTful chuẩn, dễ tích hợp với Frontend

---

## 📂 CẤU TRÚC DỰ ÁN

```
backend/
├── src/
│   ├── server.ts                     # Entry point của ứng dụng
│   │
│   ├── config/                       # Cấu hình hệ thống
│   │   ├── cors.ts                   # Cấu hình CORS
│   │   ├── database.ts               # Kết nối MongoDB
│   │   └── environment.ts            # Biến môi trường
│   │
│   ├── models/                       # Database Schemas (MongoDB Models)
│   │   ├── user.model.ts             # Model người dùng
│   │   ├── topic.model.ts            # Model chủ đề học
│   │   ├── vocabulary.model.ts       # Model từ vựng
│   │   ├── quiz.model.ts             # Model quiz
│   │   ├── quizResult.model.ts       # Model kết quả quiz
│   │   ├── point.model.ts            # Model điểm thưởng
│   │   ├── streak.model.ts           # Model chuỗi ngày học
│   │   ├── streakLog.model.ts        # Model log streak
│   │   ├── userProgress.model.ts     # Model tiến độ người dùng
│   │   ├── shopItem.model.ts         # Model item cửa hàng
│   │   ├── purchase.model.ts         # Model lịch sử mua hàng
│   │   └── question.model.ts         # Model câu hỏi
│   │
│   ├── controllers/                  # Controllers xử lý request/response
│   │   ├── auth.controller.ts        # Controller xác thực
│   │   ├── user.controller.ts        # Controller quản lý user
│   │   ├── topic.controller.ts       # Controller chủ đề & từ vựng
│   │   └── quiz.controller.ts        # Controller quiz
│   │
│   ├── services/                     # Business Logic Layer
│   │   ├── auth.service.ts           # Logic xác thực & bảo mật
│   │   ├── user.service.ts           # Logic quản lý user
│   │   ├── topic.service.ts          # Logic topics & vocabularies
│   │   ├── quiz.service.ts           # Logic chấm điểm quiz
│   │   ├── point.service.ts          # Logic quản lý điểm
│   │   ├── streak.service.ts         # Logic tính streak
│   │   ├── stats.service.ts          # Logic thống kê
│   │   └── leaderboard.service.ts    # Logic bảng xếp hạng
│   │
│   ├── middlewares/                  # Middlewares
│   │   ├── auth.middleware.ts        # Middleware xác thực JWT
│   │   └── exampleMiddleware.ts      # Template middleware
│   │
│   ├── routes/v1/                    # API Routes Version 1
│   │   ├── index.ts                  # Route aggregator
│   │   ├── auth.route.ts             # Routes xác thực
│   │   ├── user.route.ts             # Routes user
│   │   ├── topic.route.ts            # Routes topics
│   │   └── quiz.route.ts             # Routes quiz
│   │
│   ├── utils/                        # Utilities
│   │   ├── algorithms.ts             # Thuật toán
│   │   ├── constants.ts              # Hằng số
│   │   └── sorts.ts                  # Thuật toán sắp xếp
│   │
│   ├── validations/                  # Validation schemas
│   │   └── exampleValidation.js
│   │
│   ├── providers/                    # External providers
│   │   └── exampleProvider.ts
│   │
│   ├── sockets/                      # Socket.io (nếu cần real-time)
│   │   └── exampleSocket.ts
│   │
│   └── docs/                         # Documentation
│       ├── QUIZ_SYSTEM_GUIDE.md      # Hướng dẫn hệ thống quiz
│       ├── ADVANCED_FEATURES.md      # Tính năng nâng cao
│       └── FRONTEND_INTEGRATION.md   # Hướng dẫn tích hợp Frontend
│
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # Tài liệu tổng quan

```

---

## 🗄️ DATABASE MODELS CHI TIẾT

### 1. User Model (user.model.ts)

**Mục đích:** Lưu thông tin người dùng và xác thực

**Schema:**
```typescript
{
  username: String,          // Tên đăng nhập (unique, 3-30 ký tự)
  email: String,             // Email (unique, validated)
  password: String,          // Mật khẩu (hashed với bcrypt, min 6 ký tự)
  points: Number,            // Điểm tổng (default: 0)
  isActive: Boolean,         // Trạng thái tài khoản (default: true)
  createdAt: Date,           // Ngày tạo
  updatedAt: Date            // Ngày cập nhật
}
```

**Đặc điểm:**
- ✅ Mật khẩu tự động hash trước khi lưu (pre-save middleware)
- ✅ Method `comparePassword()` để verify mật khẩu
- ✅ Tự động loại bỏ password khi trả về JSON
- ✅ Validation email format với regex
- ✅ Username unique index để tìm kiếm nhanh

---

### 2. Topic Model (topic.model.ts)

**Mục đích:** Quản lý các chủ đề học tập (ví dụ: Animals, Food, Technology...)

**Schema:**
```typescript
{
  name: String,              // Tên chủ đề (required)
  description: String,       // Mô tả chủ đề (optional)
  createdAt: Date,
  updatedAt: Date
}
```

**Quan hệ:**
- Một Topic có nhiều Vocabulary (1-to-many)
- Một Topic có nhiều Quiz (1-to-many)

---

### 3. Vocabulary Model (vocabulary.model.ts)

**Mục đích:** Lưu trữ từ vựng tiếng Anh với các thông tin liên quan

**Schema:**
```typescript
{
  word: String,              // Từ vựng (required)
  meaning: String,           // Nghĩa tiếng Việt (required)
  pronunciation: String,     // Phát âm IPA (optional)
  example: String,           // Câu ví dụ (optional)
  imageUrl: String,          // URL ảnh minh họa (optional)
  audioUrl: String,          // URL file phát âm (optional)
  topic: ObjectId,           // Tham chiếu đến Topic (ref: 'Topic')
  choices: [String],         // Mảng đáp án sai cho multiple choice
  difficulty: String,        // Độ khó: 'easy' | 'medium' | 'hard'
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `topic`: Index để query nhanh theo chủ đề
- `difficulty`: Index để filter theo độ khó
- Text index trên `word` và `meaning` để search

---

### 4. Quiz Model (quiz.model.ts)

**Mục đích:** Đại diện cho một bài quiz (chủ yếu dùng để reference)

**Schema:**
```typescript
{
  topic: ObjectId,           // Chủ đề của quiz (ref: 'Topic')
  title: String,             // Tiêu đề quiz
  createdAt: Date,
  updatedAt: Date
}
```

---

### 5. QuizResult Model (quizResult.model.ts)

**Mục đích:** Lưu kết quả mỗi lần user làm quiz

**Schema:**
```typescript
{
  user: ObjectId,            // User làm quiz (ref: 'User')
  topic: ObjectId,           // Topic của quiz (ref: 'Topic')
  totalQuestions: Number,    // Tổng số câu hỏi
  correctAnswers: Number,    // Số câu trả lời đúng
  score: Number,             // Điểm đạt được
  answers: [                 // Chi tiết từng câu trả lời
    {
      vocabId: ObjectId,
      selectedAnswer: String,
      correctAnswer: String,
      isCorrect: Boolean
    }
  ],
  completionTime: Number,    // Thời gian hoàn thành (seconds)
  createdAt: Date,           // Thời điểm làm quiz
  updatedAt: Date
}
```

**Sử dụng:**
- Lưu lịch sử làm bài của user
- Phân tích điểm yếu/mạnh
- Thống kê tiến độ học tập

---

### 6. Point Model (point.model.ts)

**Mục đích:** Quản lý điểm thưởng của user (để xếp hạng và mua items)

**Schema:**
```typescript
{
  user: ObjectId,            // User (unique, ref: 'User')
  totalPoints: Number,       // Tổng điểm tích lũy (min: 0)
  weeklyPoints: Number,      // Điểm trong tuần (reset hàng tuần)
  monthlyPoints: Number,     // Điểm trong tháng (reset hàng tháng)
  lastWeekReset: Date,       // Lần reset điểm tuần gần nhất
  lastMonthReset: Date,      // Lần reset điểm tháng gần nhất
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `totalPoints`: Descending index cho leaderboard tổng
- `weeklyPoints`: Descending index cho leaderboard tuần
- `monthlyPoints`: Descending index cho leaderboard tháng

**Logic:**
- Mỗi câu đúng = 10 điểm
- Điểm được cộng dồn vào totalPoints, weeklyPoints, monthlyPoints
- Có cron job reset weeklyPoints và monthlyPoints định kỳ

---

### 7. Streak Model (streak.model.ts)

**Mục đích:** Theo dõi chuỗi ngày học liên tục (khuyến khích học đều đặn)

**Schema:**
```typescript
{
  user: ObjectId,            // User (unique, ref: 'User')
  currentStreak: Number,     // Streak hiện tại (số ngày liên tục)
  longestStreak: Number,     // Streak dài nhất từng đạt được
  lastStudyDate: Date,       // Ngày học gần nhất
  totalDaysStudied: Number,  // Tổng số ngày đã học
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `longestStreak`: Descending cho leaderboard
- `currentStreak`: Descending cho leaderboard

**Logic tính Streak:**
```javascript
// Nếu học hôm nay rồi → giữ nguyên
// Nếu hôm qua có học → currentStreak + 1
// Nếu hôm qua KHÔNG học → reset currentStreak = 1
// Luôn cập nhật longestStreak nếu currentStreak > longestStreak
```

---

### 8. StreakLog Model (streakLog.model.ts)

**Mục đích:** Log chi tiết từng ngày học (để phân tích và hiển thị calendar)

**Schema:**
```typescript
{
  user: ObjectId,            // User (ref: 'User')
  date: Date,                // Ngày học
  activitiesCount: Number,   // Số hoạt động trong ngày
  createdAt: Date
}
```

---

### 9. UserProgress Model (userProgress.model.ts)

**Mục đích:** Theo dõi tiến độ học từng topic

**Schema:**
```typescript
{
  user: ObjectId,            // User (ref: 'User')
  topic: ObjectId,           // Topic (ref: 'Topic')
  masteredWords: Number,     // Số từ đã thành thạo
  totalWords: Number,        // Tổng số từ trong topic
  lastStudied: Date,         // Lần học gần nhất
  createdAt: Date,
  updatedAt: Date
}
```

---

### 10. ShopItem Model (shopItem.model.ts)

**Mục đích:** Các item có thể mua bằng điểm (power-ups, themes, avatars...)

**Schema:**
```typescript
{
  name: String,              // Tên item
  price: Number,             // Giá (bằng points)
  createdAt: Date,
  updatedAt: Date
}
```

---

### 11. Purchase Model (purchase.model.ts)

**Mục đích:** Lịch sử mua hàng của user

**Schema:**
```typescript
{
  user: ObjectId,            // User mua (ref: 'User')
  item: ObjectId,            // Item đã mua (ref: 'ShopItem')
  price: Number,             // Giá tại thời điểm mua
  createdAt: Date            // Thời điểm mua
}
```

---

## 🔄 LUỒNG HOẠT ĐỘNG CHÍNH

### Flow 1: Đăng ký & Đăng nhập

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /api/v1/auth/register
       │ { username, email, password }
       ▼
┌─────────────────────────────┐
│  Auth Controller            │
│  - Validate input           │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Auth Service               │
│  - Check email exists       │
│  - Hash password (bcrypt)   │
│  - Create user in DB        │
│  - Generate JWT token       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Response                   │
│  { token, user }            │
└─────────────────────────────┘
```

**Đăng nhập:**
```
POST /api/v1/auth/login
{ email, password }
       ↓
1. Tìm user theo email (select +password)
2. So sánh password (bcrypt.compare)
3. Generate JWT token
4. Return { token, user }
```

---

### Flow 2: Làm Quiz (End-to-End)

```
┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 1: Lấy từ vựng để làm quiz                                  │
└──────────────────────────────────────────────────────────────────┘

Client → GET /api/v1/topics/:topicId/vocabularies?random=true&count=10
         ↓
Topic Controller → Topic Service
         ↓
Topic Service: 
  - Aggregate random 10 từ từ database
  - Populate choices (đáp án sai) cho mỗi từ
  - Return vocabularies
         ↓
Client nhận: [
  { _id, word: "cat", meaning: "con mèo", choices: [...] },
  ...
]

┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 2: User làm quiz trên client                                │
└──────────────────────────────────────────────────────────────────┘

Client: 
  - Hiển thị 10 câu hỏi
  - User chọn đáp án
  - Lưu answers vào array

┌──────────────────────────────────────────────────────────────────┐
│ BƯỚC 3: Submit quiz và nhận kết quả                              │
└──────────────────────────────────────────────────────────────────┘

Client → POST /api/v1/quizzes/submit
         Headers: { Authorization: "Bearer <token>" }
         Body: {
           topicId: "123",
           answers: [
             { vocabId: "abc", selectedAnswer: "con mèo" },
             { vocabId: "def", selectedAnswer: "con chó" },
             ...
           ]
         }
         ↓
Auth Middleware:
  - Verify JWT token
  - Attach user to req.user
         ↓
Quiz Controller → Quiz Service
         ↓
Quiz Service (submitQuiz):
  
  ① Lấy đáp án ĐÚNG từ database (KHÔNG tin client):
     vocabularies = await Vocabulary.find({ _id: { $in: vocabIds } })
  
  ② Tạo map để tra cứu nhanh:
     vocabMap = Map<vocabId, vocab>
  
  ③ So sánh từng câu:
     for each userAnswer:
       correctAnswer = vocabMap.get(vocabId).meaning
       isCorrect = (selectedAnswer === correctAnswer)
       if (isCorrect) correctCount++
  
  ④ Tính điểm:
     score = correctCount * 10
  
  ⑤ Lưu QuizResult:
     await QuizResult.create({
       user, topic, totalQuestions, correctAnswers, score, answers
     })
  
  ⑥ Cộng điểm:
     await Point.findOneAndUpdate(
       { user },
       { $inc: { totalPoints: score, weeklyPoints: score, monthlyPoints: score } },
       { upsert: true }
     )
  
  ⑦ Cập nhật Streak:
     streak = await Streak.findOne({ user })
     if (học hôm qua) streak.currentStreak++
     else streak.currentStreak = 1
     if (currentStreak > longestStreak) update longestStreak
     await streak.save()
         ↓
Response: {
  totalQuestions: 10,
  correctAnswers: 7,
  score: 70,
  incorrectAnswers: [
    { word: "dog", yourAnswer: "con mèo", correctAnswer: "con chó" },
    ...
  ],
  pointsEarned: 70,
  streak: { currentStreak: 5, longestStreak: 10 }
}
```

**❗ QUAN TRỌNG: Tại sao phải lấy đáp án từ database?**

**❌ Cách SAI (dễ bị hack):**
```javascript
// Client gửi:
{
  answers: [
    { vocabId: "abc", selectedAnswer: "con mèo", isCorrect: true }  // ← Client tự đánh dấu đúng!
  ]
}

// Server tin client:
const score = answers.filter(a => a.isCorrect).length * 10  // ← Nguy hiểm!
```
→ Hacker có thể sửa isCorrect = true cho tất cả câu!

**✅ Cách ĐÚNG (an toàn):**
```javascript
// Client chỉ gửi câu trả lời:
{
  answers: [
    { vocabId: "abc", selectedAnswer: "con mèo" }
  ]
}

// Server tự lấy đáp án đúng và chấm:
const vocab = await Vocabulary.findById("abc")  // ← Lấy từ DB
const isCorrect = (selectedAnswer === vocab.meaning)  // ← Server tự chấm
```

---

### Flow 3: Xem thống kê cá nhân

```
Client → GET /api/v1/stats/me
         Headers: { Authorization: "Bearer <token>" }
         ↓
Auth Middleware → verify token → req.user
         ↓
Stats Controller → Stats Service
         ↓
Stats Service (getUserOverallStats):
  
  Promise.all([
    // Lấy điểm
    Point.findOne({ user }).select('totalPoints weeklyPoints monthlyPoints'),
    
    // Lấy streak
    Streak.findOne({ user }).select('currentStreak longestStreak totalDaysStudied'),
    
    // Aggregate quiz stats
    QuizResult.aggregate([
      { $match: { user } },
      { $group: {
          totalQuizzes: { $sum: 1 },
          totalQuestions: { $sum: '$totalQuestions' },
          totalCorrect: { $sum: '$correctAnswers' },
          ...
        }
      }
    ])
  ])
  
  Calculate accuracy = (totalCorrect / totalQuestions) * 100
  
  Return {
    points: { total, weekly, monthly },
    streak: { current, longest, totalDays },
    quiz: { totalCompleted, accuracy, totalScore, ... }
  }
```

---

### Flow 4: Xem Leaderboard

```
Client → GET /api/v1/leaderboard/total?page=1&limit=10
         ↓
Leaderboard Controller → Leaderboard Service
         ↓
Leaderboard Service:
  
  leaderboard = await Point.find()
    .populate('user', 'username email')  // Join với User
    .select('user totalPoints')
    .sort({ totalPoints: -1 })  // Sắp xếp giảm dần (index!)
    .skip((page - 1) * limit)
    .limit(limit)
  
  Add rank:
    leaderboard.map((entry, index) => ({
      rank: skip + index + 1,
      user: entry.user,
      totalPoints: entry.totalPoints
    }))
  
  Return {
    leaderboard: [...],
    pagination: { page, limit, total, totalPages }
  }
```

---

## 🌐 API ENDPOINTS CHI TIẾT

### Base URL
```
http://localhost:5000/api/v1
```

---

### 🔐 Authentication Endpoints

#### 1. Đăng ký tài khoản
```http
POST /api/v1/auth/register

Request Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "123456"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "points": 0,
      "isActive": true
    }
  }
}
```

#### 2. Đăng nhập
```http
POST /api/v1/auth/login

Request Body:
{
  "email": "john@example.com",
  "password": "123456"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": { ... }
  }
}
```

#### 3. Đăng xuất
```http
POST /api/v1/auth/logout

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

#### 4. Lấy thông tin user hiện tại (Protected)
```http
GET /api/v1/auth/me
Headers: { "Authorization": "Bearer <token>" }

Response: 200 OK
{
  "success": true,
  "data": {
    "_id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "points": 150,
    ...
  }
}
```

#### 5. Cập nhật profile (Protected)
```http
PUT /api/v1/auth/profile
Headers: { "Authorization": "Bearer <token>" }

Request Body:
{
  "username": "john_updated"
}

Response: 200 OK
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

#### 6. Đổi mật khẩu (Protected)
```http
PUT /api/v1/auth/change-password
Headers: { "Authorization": "Bearer <token>" }

Request Body:
{
  "currentPassword": "123456",
  "newPassword": "new_password"
}

Response: 200 OK
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 👥 User Management Endpoints

#### 1. Tạo user mới (Admin)
```http
POST /api/v1/users

Request Body:
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "123456"
}

Response: 201 Created
```

#### 2. Lấy danh sách users
```http
GET /api/v1/users?page=1&limit=10

Response: 200 OK
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": { ... }
  }
}
```

#### 3. Lấy user theo ID
```http
GET /api/v1/users/:id

Response: 200 OK
```

#### 4. Cập nhật user
```http
PUT /api/v1/users/:id

Request Body: { ... }

Response: 200 OK
```

#### 5. Xóa user
```http
DELETE /api/v1/users/:id

Response: 200 OK
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### 📚 Topic & Vocabulary Endpoints

#### 1. Lấy tất cả topics
```http
GET /api/v1/topics?page=1&limit=10

Response: 200 OK
{
  "success": true,
  "message": "Topics retrieved successfully",
  "data": {
    "topics": [
      {
        "_id": "...",
        "name": "Animals",
        "description": "Learn animal names",
        "createdAt": "...",
        "updatedAt": "..."
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### 2. Lấy topic theo ID
```http
GET /api/v1/topics/:topicId

Response: 200 OK
{
  "success": true,
  "message": "Topic retrieved successfully",
  "data": {
    "_id": "...",
    "name": "Animals",
    "description": "...",
    ...
  }
}
```

#### 3. Lấy từ vựng theo topic (Có pagination)
```http
GET /api/v1/topics/:topicId/vocabularies?page=1&limit=20

Response: 200 OK
{
  "success": true,
  "message": "Vocabularies retrieved successfully",
  "data": {
    "vocabularies": [
      {
        "_id": "...",
        "word": "cat",
        "meaning": "con mèo",
        "pronunciation": "/kæt/",
        "example": "I have a cat.",
        "imageUrl": "https://...",
        "audioUrl": "https://...",
        "difficulty": "easy",
        "choices": ["con chó", "con gà", "con vịt"]
      },
      ...
    ],
    "pagination": { ... }
  }
}
```

#### 4. Lấy từ vựng ngẫu nhiên (Dùng cho quiz)
```http
GET /api/v1/topics/:topicId/vocabularies?random=true&count=10

Response: 200 OK
{
  "success": true,
  "message": "Vocabularies retrieved successfully",
  "data": {
    "vocabularies": [
      // Random 10 từ vựng với choices đã được tạo
      ...
    ]
  }
}
```

**Giải thích parameter:**
- `random=true`: Lấy ngẫu nhiên thay vì pagination
- `count=10`: Số lượng từ cần lấy

---

### 📝 Quiz Endpoints

#### 1. Submit quiz (Protected)
```http
POST /api/v1/quizzes/submit
Headers: { "Authorization": "Bearer <token>" }

Request Body:
{
  "topicId": "64abc123...",
  "answers": [
    {
      "vocabId": "64def456...",
      "selectedAnswer": "con mèo"
    },
    {
      "vocabId": "64def789...",
      "selectedAnswer": "con chó"
    },
    ...
  ]
}

Response: 200 OK
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "totalQuestions": 10,
    "correctAnswers": 7,
    "score": 70,
    "incorrectAnswers": [
      {
        "vocabId": "...",
        "word": "dog",
        "yourAnswer": "con mèo",
        "correctAnswer": "con chó"
      },
      ...
    ],
    "pointsEarned": 70,
    "streak": {
      "currentStreak": 5,
      "longestStreak": 10
    }
  }
}
```

**Flow khi submit:**
1. ✅ Xác thực JWT → lấy userId
2. ✅ Validate input (topicId, answers array)
3. ✅ Lấy đáp án đúng từ database (KHÔNG tin client)
4. ✅ So sánh và chấm điểm
5. ✅ Lưu QuizResult vào DB
6. ✅ Cộng điểm vào Point model
7. ✅ Cập nhật Streak
8. ✅ Trả về kết quả chi tiết

#### 2. Lấy lịch sử quiz (Protected)
```http
GET /api/v1/quizzes/history?page=1&limit=10
Headers: { "Authorization": "Bearer <token>" }

Response: 200 OK
{
  "success": true,
  "message": "Quiz history retrieved successfully",
  "data": {
    "results": [
      {
        "_id": "...",
        "topic": {
          "_id": "...",
          "name": "Animals"
        },
        "totalQuestions": 10,
        "correctAnswers": 8,
        "score": 80,
        "createdAt": "2026-03-01T10:30:00Z"
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

---

### 📊 Statistics Endpoints (Protected)

*Note: Các endpoints này cần được thêm vào routes, hiện tại chỉ có service.*

#### 1. Thống kê tổng quan
```http
GET /api/v1/stats/me
Headers: { "Authorization": "Bearer <token>" }

Expected Response: 200 OK
{
  "success": true,
  "data": {
    "points": {
      "total": 850,
      "weekly": 120,
      "monthly": 450
    },
    "streak": {
      "current": 5,
      "longest": 12,
      "totalDays": 45
    },
    "quiz": {
      "totalCompleted": 85,
      "totalQuestions": 850,
      "totalCorrect": 680,
      "accuracy": 80.00,
      "totalScore": 6800,
      "avgCompletionTime": 180
    }
  }
}
```

#### 2. Thống kê theo tuần
```http
GET /api/v1/stats/weekly
Headers: { "Authorization": "Bearer <token>" }

Expected Response: 200 OK
{
  "success": true,
  "data": {
    "dailyActivity": [
      { "date": "2026-02-24", "quizzes": 2, "points": 80, "accuracy": 80 },
      { "date": "2026-02-25", "quizzes": 1, "points": 60, "accuracy": 60 },
      ...
    ],
    "totalQuizzes": 10,
    "totalPoints": 450,
    "avgAccuracy": 75.5
  }
}
```

#### 3. Thống kê theo tháng
```http
GET /api/v1/stats/monthly
Headers: { "Authorization": "Bearer <token>" }
```

#### 4. Thống kê theo topic
```http
GET /api/v1/stats/by-topic
Headers: { "Authorization": "Bearer <token>" }

Expected Response: 200 OK
{
  "success": true,
  "data": [
    {
      "topic": {
        "_id": "...",
        "name": "Animals"
      },
      "totalQuizzes": 15,
      "totalQuestions": 150,
      "correctAnswers": 120,
      "accuracy": 80,
      "totalScore": 1200,
      "lastAttempt": "2026-03-01T..."
    },
    ...
  ]
}
```

---

### 🏆 Leaderboard Endpoints

*Note: Cần thêm routes, hiện tại chỉ có service.*

#### 1. Bảng xếp hạng tổng điểm (All-time)
```http
GET /api/v1/leaderboard/total?page=1&limit=10

Expected Response: 200 OK
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "_id": "...",
          "username": "top_player",
          "email": "top@example.com"
        },
        "totalPoints": 5000
      },
      {
        "rank": 2,
        "user": { ... },
        "totalPoints": 4500
      },
      ...
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "totalPages": 15
    }
  }
}
```

#### 2. Bảng xếp hạng tuần
```http
GET /api/v1/leaderboard/weekly?page=1&limit=10

Expected Response: Similar structure, sắp xếp theo weeklyPoints
```

#### 3. Bảng xếp hạng tháng
```http
GET /api/v1/leaderboard/monthly?page=1&limit=10

Expected Response: Similar structure, sắp xếp theo monthlyPoints
```

#### 4. Bảng xếp hạng streak
```http
GET /api/v1/leaderboard/streak?page=1&limit=10

Expected Response: 200 OK
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": { ... },
        "currentStreak": 30,
        "longestStreak": 45
      },
      ...
    ],
    "pagination": { ... }
  }
}
```

---

## 🛠️ SERVICES CHI TIẾT

### 1. Auth Service (auth.service.ts)

**Chức năng:**
- ✅ Register user mới
- ✅ Login (verify password + generate JWT)
- ✅ Get current user
- ✅ Update profile
- ✅ Change password
- ✅ Logout

**Key Methods:**

```typescript
// Đăng ký
register(userData: { username, email, password }):
  - Check email đã tồn tại chưa
  - Create user (password auto hash bởi pre-save middleware)
  - Generate JWT token
  - Return { token, user }

// Đăng nhập
login(credentials: { email, password }):
  - Find user by email (select +password)
  - Compare password using bcrypt
  - Generate JWT token
  - Return { token, user }

// Lấy thông tin user hiện tại
getCurrentUser(userId):
  - Find user by ID
  - Populate additional info nếu cần
  - Return user

// Đổi mật khẩu
changePassword(userId, currentPassword, newPassword):
  - Find user (select +password)
  - Verify currentPassword
  - Update password (auto hash)
  - Save
```

---

### 2. Quiz Service (quiz.service.ts)

**Chức năng:**
- ✅ Chấm điểm quiz
- ✅ Lấy lịch sử quiz

**Key Method: submitQuiz**

```typescript
submitQuiz(userId, topicId, userAnswers):
  
  // Bước 1: Lấy đáp án từ DB
  const vocabIds = userAnswers.map(ans => ans.vocabId)
  const vocabularies = await Vocabulary.find({ _id: { $in: vocabIds } })
  
  // Bước 2: Tạo Map để tra cứu nhanh
  const vocabMap = new Map()
  vocabularies.forEach(vocab => {
    vocabMap.set(vocab._id.toString(), vocab)
  })
  
  // Bước 3: Chấm từng câu
  let correctCount = 0
  const incorrectAnswers = []
  
  userAnswers.forEach(userAns => {
    const vocab = vocabMap.get(userAns.vocabId)
    if (!vocab) return
    
    const correctAnswer = vocab.meaning.toLowerCase().trim()
    const selectedAnswer = userAns.selectedAnswer.toLowerCase().trim()
    const isCorrect = selectedAnswer === correctAnswer
    
    if (isCorrect) {
      correctCount++
    } else {
      incorrectAnswers.push({
        vocabId: userAns.vocabId,
        word: vocab.word,
        yourAnswer: userAns.selectedAnswer,
        correctAnswer: vocab.meaning
      })
    }
  })
  
  // Bước 4: Tính điểm
  const score = correctCount * 10
  
  // Bước 5: Lưu QuizResult
  await QuizResult.create({
    user: userId,
    topic: topicId,
    totalQuestions: userAnswers.length,
    correctAnswers: correctCount,
    score,
    answers: detailedAnswers
  })
  
  // Bước 6: Cộng điểm
  await addPoints(userId, score)
  
  // Bước 7: Cập nhật Streak
  const streak = await updateStreak(userId)
  
  // Bước 8: Trả về kết quả
  return {
    totalQuestions,
    correctAnswers: correctCount,
    score,
    incorrectAnswers,
    pointsEarned: score,
    streak: {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    }
  }
```

**Security Note:**
- ❌ KHÔNG BAO GIỜ tin dữ liệu client gửi lên về correctness
- ✅ LUÔN LUÔN lấy đáp án đúng từ database và tự chấm
- ✅ Client chỉ gửi câu trả lời, server tự xác định đúng/sai

---

### 3. Point Service (point.service.ts)

**Chức năng:**
- ✅ Cộng điểm cho user
- ✅ Trừ điểm (khi mua items)
- ✅ Reset điểm tuần/tháng
- ✅ Lấy điểm của user

**Key Method: addPoints**

```typescript
addPoints(userId, points):
  
  await Point.findOneAndUpdate(
    { user: userId },
    { 
      $inc: { 
        totalPoints: points,
        weeklyPoints: points,
        monthlyPoints: points
      }
    },
    { 
      upsert: true,      // Tạo mới nếu chưa có
      new: true,         // Return document sau khi update
      setDefaultsOnInsert: true
    }
  )
  
  // $inc: Increment operator - cộng dồn vào giá trị hiện tại
  // upsert: true - Nếu chưa có record thì tạo mới
```

**Method: resetWeeklyPoints**
```typescript
resetWeeklyPoints():
  await Point.updateMany(
    {},
    { 
      weeklyPoints: 0,
      lastWeekReset: new Date()
    }
  )
  
  // Gọi bởi cron job mỗi thứ 2 hàng tuần
```

---

### 4. Streak Service (streak.service.ts)

**Chức năng:**
- ✅ Cập nhật streak khi user học
- ✅ Tính toán streak logic

**Key Method: updateStreak**

```typescript
updateStreak(userId):
  
  // Lấy streak hiện tại
  let streak = await Streak.findOne({ user: userId })
  if (!streak) {
    streak = await Streak.create({ user: userId })
  }
  
  // Chuẩn hóa ngày (set time về 00:00:00)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const lastStudy = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null
  if (lastStudy) {
    lastStudy.setHours(0, 0, 0, 0)
  }
  
  // Case 1: Chưa có lastStudyDate (user mới)
  if (!lastStudy) {
    streak.currentStreak = 1
    streak.longestStreak = 1
    streak.totalDaysStudied = 1
    streak.lastStudyDate = today
    await streak.save()
    return streak
  }
  
  // Case 2: Đã học hôm nay rồi → không làm gì
  const isSameDay = lastStudy.getTime() === today.getTime()
  if (isSameDay) {
    return streak
  }
  
  // Case 3: Check có phải hôm qua không
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const isYesterday = lastStudy.getTime() === yesterday.getTime()
  
  if (isYesterday) {
    // Học liên tục → tăng streak
    streak.currentStreak += 1
  } else {
    // Bỏ ngày → reset streak
    streak.currentStreak = 1
  }
  
  // Cập nhật longestStreak nếu cần
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak
  }
  
  // Tăng totalDaysStudied
  streak.totalDaysStudied += 1
  
  // Cập nhật lastStudyDate
  streak.lastStudyDate = today
  
  await streak.save()
  
  return streak
```

**Streak Logic Flow:**
```
┌─────────────────────────────────────────────────────┐
│ User học bài → submitQuiz → updateStreak           │
└─────────────────────────────────────────────────────┘
                    ↓
         ┌──────────────────────┐
         │ Lấy lastStudyDate    │
         └──────────┬───────────┘
                    ↓
         ┌──────────────────────┐
         │ So sánh với hôm nay  │
         └──────────┬───────────┘
                    ↓
    ┌───────────────┴────────────────┐
    │                                │
Đã học hôm nay?              Chưa học hôm nay
    │                                │
Return (không làm gì)                ↓
                        ┌────────────────────┐
                        │ Hôm qua có học?    │
                        └────────┬───────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
               Có (isYesterday)        Không (bỏ ngày)
                    │                         │
            currentStreak++           currentStreak = 1
                    │                         │
                    └────────────┬────────────┘
                                 ↓
                    ┌────────────────────────┐
                    │ Update longestStreak?  │
                    └────────────┬───────────┘
                                 ↓
                    ┌────────────────────────┐
                    │ totalDaysStudied++     │
                    └────────────┬───────────┘
                                 ↓
                    ┌────────────────────────┐
                    │ lastStudyDate = today  │
                    └────────────┬───────────┘
                                 ↓
                            await save()
```

---

### 5. Topic Service (topic.service.ts)

**Chức năng:**
- ✅ Lấy danh sách topics (pagination)
- ✅ Lấy topic theo ID
- ✅ Lấy vocabularies theo topic (pagination hoặc random)

**Key Method: getVocabulariesByTopic**

```typescript
getVocabulariesByTopic(topicId, options):
  
  const { random, randomCount, page, limit } = options
  
  // Nếu muốn random (dùng cho quiz)
  if (random) {
    const vocabularies = await Vocabulary.aggregate([
      { $match: { topic: new ObjectId(topicId) } },
      { $sample: { size: randomCount || 10 } }  // Random aggregate
    ])
    
    // Tạo choices cho mỗi từ (multiple choice)
    for (let vocab of vocabularies) {
      if (!vocab.choices || vocab.choices.length < 3) {
        // Lấy 3 nghĩa ngẫu nhiên khác làm đáp án sai
        const wrongChoices = await Vocabulary.aggregate([
          { $match: { 
              topic: new ObjectId(topicId),
              _id: { $ne: vocab._id }
            } 
          },
          { $sample: { size: 3 } },
          { $project: { meaning: 1 } }
        ])
        
        vocab.choices = wrongChoices.map(c => c.meaning)
      }
    }
    
    return { vocabularies }
  }
  
  // Nếu không random → pagination bình thường
  const skip = (page - 1) * limit
  
  const vocabularies = await Vocabulary.find({ topic: topicId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
  
  const total = await Vocabulary.countDocuments({ topic: topicId })
  
  return {
    vocabularies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
```

---

### 6. Stats Service (stats.service.ts)

**Chức năng:**
- ✅ Thống kê tổng quan user
- ✅ Thống kê theo tuần
- ✅ Thống kê theo tháng
- ✅ Thống kê theo topic
- ✅ Thống kê streak calendar

**Key Method: getUserOverallStats**

```typescript
getUserOverallStats(userId):
  
  // Sử dụng Promise.all để query parallel (nhanh hơn)
  const [points, streak, quizStats] = await Promise.all([
    
    // Query 1: Lấy điểm
    Point.findOne({ user: userId })
      .select('totalPoints weeklyPoints monthlyPoints'),
    
    // Query 2: Lấy streak
    Streak.findOne({ user: userId })
      .select('currentStreak longestStreak totalDaysStudied'),
    
    // Query 3: Aggregate quiz statistics
    QuizResult.aggregate([
      { $match: { user: new ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalQuestions: { $sum: '$totalQuestions' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalScore: { $sum: '$score' },
          avgCompletionTime: { $avg: '$completionTime' }
        }
      }
    ])
  ])
  
  // Tính accuracy
  const quizData = quizStats[0] || { ... defaults ... }
  const accuracy = quizData.totalQuestions > 0
    ? (quizData.totalCorrect / quizData.totalQuestions) * 100
    : 0
  
  return {
    points: {
      total: points?.totalPoints || 0,
      weekly: points?.weeklyPoints || 0,
      monthly: points?.monthlyPoints || 0
    },
    streak: {
      current: streak?.currentStreak || 0,
      longest: streak?.longestStreak || 0,
      totalDays: streak?.totalDaysStudied || 0
    },
    quiz: {
      totalCompleted: quizData.totalQuizzes,
      totalQuestions: quizData.totalQuestions,
      totalCorrect: quizData.totalCorrect,
      accuracy: Math.round(accuracy * 100) / 100,
      totalScore: quizData.totalScore,
      avgCompletionTime: Math.round(quizData.avgCompletionTime || 0)
    }
  }
```

**Method: getWeeklyStats**

```typescript
getWeeklyStats(userId):
  
  // Tính khoảng thời gian 7 ngày
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  
  // Aggregate quiz data theo ngày
  const weeklyQuizzes = await QuizResult.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        createdAt: { $gte: sevenDaysAgo, $lte: today }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        quizzes: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        correctAnswers: { $sum: '$correctAnswers' },
        points: { $sum: '$score' }
      }
    },
    { $sort: { _id: 1 } }
  ])
  
  // Tạo array 7 ngày (fill 0 cho ngày không học)
  const dailyActivity = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayData = weeklyQuizzes.find(d => d._id === dateStr)
    
    dailyActivity.push({
      date: dateStr,
      quizzes: dayData?.quizzes || 0,
      points: dayData?.points || 0,
      accuracy: dayData
        ? (dayData.correctAnswers / dayData.totalQuestions) * 100
        : 0
    })
  }
  
  return {
    dailyActivity,
    totalQuizzes: weeklyQuizzes.reduce((sum, d) => sum + d.quizzes, 0),
    totalPoints: weeklyQuizzes.reduce((sum, d) => sum + d.points, 0),
    avgAccuracy: ...
  }
```

---

### 7. Leaderboard Service (leaderboard.service.ts)

**Chức năng:**
- ✅ Leaderboard tổng điểm (all-time)
- ✅ Leaderboard tuần
- ✅ Leaderboard tháng
- ✅ Leaderboard streak
- ✅ Leaderboard theo topic

**Key Method: getTotalPointsLeaderboard**

```typescript
getTotalPointsLeaderboard(options):
  
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit
  
  // Query với index trên totalPoints (nhanh!)
  const leaderboard = await Point.find()
    .populate('user', 'username email')  // Join với User collection
    .select('user totalPoints')
    .sort({ totalPoints: -1 })  // DESC (index hỗ trợ!)
    .skip(skip)
    .limit(limit)
    .lean()  // Lean() để query nhanh hơn
  
  // Thêm rank cho mỗi entry
  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,  // Tính rank dựa vào pagination
    user: entry.user,
    totalPoints: entry.totalPoints
  }))
  
  const total = await Point.countDocuments()
  
  return {
    leaderboard: leaderboardWithRank,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
```

**Performance Note:**
- ✅ Sử dụng index trên `totalPoints: -1` → query cực nhanh
- ✅ `.lean()` để skip Mongoose document overhead
- ✅ `.populate()` chỉ lấy fields cần thiết
- ✅ Pagination để tránh load quá nhiều data

---

## 🔐 AUTHENTICATION & SECURITY

### JWT Authentication Flow

#### 1. Generate Token (khi login/register)
```typescript
import jwt from 'jsonwebtoken'

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },                    // Payload
    process.env.JWT_SECRET,        // Secret key
    { expiresIn: '7d' }           // Token hết hạn sau 7 ngày
  )
}
```

#### 2. Protect Middleware (xác thực request)
```typescript
// middlewares/auth.middleware.ts

export const protect = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }
    
    const token = authHeader.split(' ')[1]  // "Bearer <token>"
    
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // 3. Lấy user từ database
    const user = await User.findById(decoded.userId).select('-password')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      })
    }
    
    // 4. Attach user vào request
    req.user = user
    
    next()  // Cho phép request tiếp tục
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
}
```

#### 3. Sử dụng trong Routes
```typescript
// routes/v1/quiz.route.ts

import { protect } from '~/middlewares/auth.middleware'

router.post('/submit', protect, quizController.submitQuiz)
//                     ↑
//                  Middleware xác thực
//           Chỉ user đã login mới gọi được API này
```

### Password Security

#### 1. Hash password (khi register/update)
```typescript
// models/user.model.ts

// Pre-save middleware - chạy TRƯỚC khi save
userSchema.pre('save', async function() {
  // Chỉ hash nếu password được modify
  if (!this.isModified('password')) return
  
  // Generate salt (random string)
  const salt = await bcrypt.genSalt(10)
  
  // Hash password với salt
  this.password = await bcrypt.hash(this.password, salt)
  
  // Lưu: "123456" → "$2a$10$N9qo8uLOickgx2ZMRZoMye..."
})
```

**Giải thích:**
- **Salt**: Chuỗi random để làm cho cùng password cũng cho hash khác nhau
- **Rounds (10)**: Số vòng lặp hash (càng cao càng an toàn nhưng chậm)
- **Result**: Không thể reverse (one-way hash)

#### 2. Verify password (khi login)
```typescript
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
  // compare("123456", "$2a$10$N9qo8uLOickgx2ZMRZoMye...") → true/false
}
```

### CORS Configuration

```typescript
// config/cors.ts

export const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}
```

**Giải thích:**
- `origin`: Domain nào được phép gọi API
- `credentials: true`: Cho phép gửi cookies/auth headers
- Trong production: Set `CLIENT_URL` trong environment variables

---

## ⚙️ ENVIRONMENT VARIABLES

```env
# config/environment.ts

NODE_ENV=development           # development | production
APP_HOST=localhost            # Server host
APP_PORT=5000                 # Server port

# MongoDB
MONGODB_URI=mongodb://localhost:27017/english_learning
# Hoặc MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_characters
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Security Notes:**
- ❌ KHÔNG BAO GIỜ commit file `.env` lên Git
- ✅ Thêm `.env` vào `.gitignore`
- ✅ Tạo `.env.example` để hướng dẫn (không có values thật)
- ✅ JWT_SECRET phải >= 32 ký tự, càng random càng tốt

---

## 🚀 CÁCH CHẠY DỰ ÁN

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình Environment
```bash
# Tạo file .env
cp .env.example .env

# Sửa các giá trị trong .env
# Đặc biệt: MONGODB_URI, JWT_SECRET
```

### 3. Start MongoDB
```bash
# Nếu dùng MongoDB local:
mongod

# Nếu dùng MongoDB Atlas: không cần start, chỉ cần connection string đúng
```

### 4. Run Development Server
```bash
npm run dev
```

Server sẽ chạy tại: `http://localhost:5000`

### 5. Build cho Production
```bash
# Build TypeScript → JavaScript
npm run build

# Start production server
npm start
```

### Available Scripts
```json
{
  "dev": "nodemon --watch src --ext ts --exec ts-node -r tsconfig-paths/register src/server.ts",
  "build": "npm run clean && tsc",
  "start": "node dist/server.js",
  "clean": "rimraf dist",
  "lint": "eslint src --ext ts --report-unused-disable-directives --max-warnings 0"
}
```

---

## 📊 DATABASE INDEXING STRATEGY

### Indexes đã tạo:

#### User Model
```typescript
{ email: 1 }          // Unique index (auto)
{ username: 1 }       // Unique index (auto)
```

#### Point Model
```typescript
{ user: 1 }           // Unique index
{ totalPoints: -1 }   // Descending cho leaderboard
{ weeklyPoints: -1 }  // Descending cho weekly leaderboard
{ monthlyPoints: -1 } // Descending cho monthly leaderboard
```

#### Streak Model
```typescript
{ user: 1 }           // Unique index
{ longestStreak: -1 } // Descending cho leaderboard
{ currentStreak: -1 } // Descending cho leaderboard
```

#### Vocabulary Model
```typescript
{ topic: 1 }          // Query theo topic
{ difficulty: 1 }     // Filter theo độ khó
{ word: 'text', meaning: 'text' }  // Text search
```

#### QuizResult Model
```typescript
{ user: 1, createdAt: -1 }  // Compound index cho quiz history
```

**Index Benefits:**
- ✅ Query nhanh hơn 10-100x
- ✅ Sorting không cần load toàn bộ data
- ✅ Unique constraints tránh duplicate

**Index Trade-offs:**
- ⚠️ Tốn thêm storage
- ⚠️ Insert/Update chậm hơn 1 chút (cần update index)

---

## 🔧 ERROR HANDLING

### Global Error Handler
```typescript
// server.ts

app.use((err, req, res, next) => {
  console.error('Error:', err?.stack)
  
  res.status(err?.statusCode || 500).json({
    message: err?.message || 'Internal Server Error',
    ...(env.NODE_ENV === 'development' && { stack: err?.stack })
    // Chỉ show stack trace trong development
  })
})
```

### Custom Error Classes (có thể thêm)
```typescript
// utils/errors.ts

export class NotFoundError extends Error {
  statusCode = 404
  constructor(message: string) {
    super(message)
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401
  constructor(message: string = 'Unauthorized') {
    super(message)
  }
}

export class ValidationError extends Error {
  statusCode = 400
  constructor(message: string) {
    super(message)
  }
}

// Sử dụng:
throw new NotFoundError('User not found')
```

---

## 📈 PERFORMANCE OPTIMIZATION

### 1. Database Query Optimization

#### ✅ Sử dụng `.lean()`
```typescript
// Slow
const users = await User.find()  // → Mongoose documents (heavy)

// Fast
const users = await User.find().lean()  // → Plain JS objects (light)
```

#### ✅ Select chỉ fields cần thiết
```typescript
// Slow - lấy toàn bộ fields
const user = await User.findById(id)

// Fast - chỉ lấy username và email
const user = await User.findById(id).select('username email')
```

#### ✅ Pagination
```typescript
// ❌ KHÔNG BAO GIỜ làm thế này:
const allUsers = await User.find()  // Load cả triệu records!

// ✅ Luôn dùng pagination:
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit)
```

#### ✅ Indexes
```typescript
// Slow - Full collection scan
await Point.find().sort({ totalPoints: -1 })

// Fast - Index scan (với index trên totalPoints)
pointSchema.index({ totalPoints: -1 })
```

### 2. Parallel Queries với Promise.all
```typescript
// Slow - Sequential (3s nếu mỗi query 1s)
const points = await Point.findOne({ user })
const streak = await Streak.findOne({ user })
const quizzes = await QuizResult.find({ user })

// Fast - Parallel (1s nếu mỗi query 1s)
const [points, streak, quizzes] = await Promise.all([
  Point.findOne({ user }),
  Streak.findOne({ user }),
  QuizResult.find({ user })
])
```

### 3. Caching (Nâng cao - chưa implement)

Có thể thêm Redis để cache:
- ✅ Leaderboard (update mỗi 5 phút)
- ✅ Topic list (ít thay đổi)
- ✅ User stats (update khi có quiz mới)

---

## 🧪 TESTING GUIDES

### Cách test API bằng Postman/Thunder Client

#### 1. Đăng ký user
```http
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```
→ Lưu `token` từ response

#### 2. Login
```http
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

#### 3. Lấy topics
```http
GET http://localhost:5000/api/v1/topics
```

#### 4. Lấy từ vựng random
```http
GET http://localhost:5000/api/v1/topics/{topicId}/vocabularies?random=true&count=10
```

#### 5. Submit quiz
```http
POST http://localhost:5000/api/v1/quizzes/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "topicId": "64abc...",
  "answers": [
    { "vocabId": "64def...", "selectedAnswer": "con mèo" },
    { "vocabId": "64ghi...", "selectedAnswer": "con chó" }
  ]
}
```

---

## 📝 TODO / FEATURES CÓ THỂ THÊM

### Phase 1 - Core Features (Đã hoàn thành ✅)
- [x] Authentication (JWT)
- [x] User Management
- [x] Topics & Vocabularies
- [x] Quiz System
- [x] Points System
- [x] Streak System
- [x] Quiz History
- [x] Leaderboard Service
- [x] Statistics Service

### Phase 2 - Missing Endpoints (Cần thêm)
- [ ] Stats routes (controller + routes)
- [ ] Leaderboard routes (controller + routes)
- [ ] Topic CRUD (create, update, delete)
- [ ] Vocabulary CRUD
- [ ] User progress tracking routes

### Phase 3 - Advanced Features
- [ ] **Multiplayer Quiz**: Real-time quiz với Socket.io
- [ ] **Shop System**: Mua items bằng points
- [ ] **Achievements/Badges**: Huy hiệu khi đạt milestone
- [ ] **Friend System**: Kết bạn, challenge bạn bè
- [ ] **Daily Challenges**: Thử thách hàng ngày
- [ ] **Vocabulary Review**: Spaced repetition algorithm
- [ ] **Listening Quiz**: Nghe và chọn đáp án
- [ ] **Speaking Quiz**: Speech-to-text API
- [ ] **Writing Quiz**: Viết câu với từ vựng
- [ ] **Image Recognition Quiz**: AI image recognition

### Phase 4 - Admin Features
- [ ] Admin Dashboard
- [ ] Content Management (CRUD topics/vocabs)
- [ ] User Management (ban, role management)
- [ ] Analytics Dashboard
- [ ] Reports & Export

### Phase 5 - Quality & Performance
- [ ] Unit Tests (Jest)
- [ ] Integration Tests
- [ ] API Documentation (Swagger)
- [ ] Redis Caching
- [ ] Rate Limiting
- [ ] Request Validation (Joi/Zod)
- [ ] Logging (Winston/Morgan)
- [ ] Monitoring (Prometheus)

### Phase 6 - DevOps
- [ ] Docker containerization
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] AWS/Heroku Deployment
- [ ] Environment configs
- [ ] Database backups
- [ ] SSL/HTTPS

---

## 🎓 KIẾN TRÚC & DESIGN PATTERNS

### Layered Architecture (3-tier)

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                 │
│         (Routes + Controllers)                  │
│  - Nhận HTTP requests                          │
│  - Validate input cơ bản                       │
│  - Gọi Business Logic Layer                    │
│  - Format response                             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│            BUSINESS LOGIC LAYER                 │
│               (Services)                        │
│  - Xử lý business rules                        │
│  - Tính toán, validation phức tạp              │
│  - Gọi Data Access Layer                       │
│  - Không biết gì về HTTP                       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│             DATA ACCESS LAYER                   │
│         (Models + Database)                     │
│  - Tương tác trực tiếp với database            │
│  - CRUD operations                             │
│  - Data validation (schema level)              │
└─────────────────────────────────────────────────┘
```

### Separation of Concerns

**Routes (Định nghĩa endpoints):**
```typescript
router.post('/submit', protect, quizController.submitQuiz)
//           ↑          ↑        ↑
//        Endpoint   Middleware  Controller
```

**Controllers (Điều phối request/response):**
```typescript
export const submitQuiz = async (req, res) => {
  const userId = req.user._id
  const { topicId, answers } = req.body
  
  // Validate
  if (!topicId || !answers) {
    return res.status(400).json({ error: 'Invalid input' })
  }
  
  // Gọi service
  const result = await quizService.submitQuiz(userId, topicId, answers)
  
  // Response
  res.status(200).json({ success: true, data: result })
}
```

**Services (Business logic):**
```typescript
export const submitQuiz = async (userId, topicId, answers) => {
  // KHÔNG biết gì về req, res, HTTP status codes
  // CHỈ xử lý logic nghiệp vụ
  
  const vocabularies = await Vocabulary.find(...)
  const score = calculateScore(answers, vocabularies)
  await saveQuizResult(...)
  await addPoints(userId, score)
  await updateStreak(userId)
  
  return { score, ... }
}
```

**Models (Data schema & validation):**
```typescript
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /regex/
  },
  ...
})
```

### Dependency Injection Pattern

```typescript
// Service không tạo dependencies, nhận từ bên ngoài
export const submitQuiz = async (
  userId,
  topicId,
  answers,
  // Có thể inject các services khác
  pointService = pointServiceImpl,
  streakService = streakServiceImpl
) => {
  ...
  await pointService.addPoints(userId, score)
  await streakService.updateStreak(userId)
  ...
}
```

---

## 🔍 DEBUGGING TIPS

### 1. Log quan trọng
```typescript
// Trong service
console.log('submitQuiz called:', { userId, topicId, answersCount: answers.length })

// Log kết quả query
const vocabs = await Vocabulary.find(...)
console.log('Found vocabularies:', vocabs.length)

// Log trước khi lưu
console.log('Saving quiz result:', { score, correctAnswers })
await QuizResult.create(...)
console.log('Quiz result saved successfully')
```

### 2. Debug MongoDB queries
```typescript
// Log query được execute
mongoose.set('debug', true)
// → Console sẽ hiện: Mongoose: users.findOne({ _id: ... })
```

### 3. Check indexes
```bash
# Trong MongoDB shell
db.points.getIndexes()
# → Xem indexes nào đã được tạo
```

### 4. Common Issues

**Issue 1: Token invalid**
```
Solution:
1. Check JWT_SECRET match với lúc generate
2. Check token format: "Bearer <token>"
3. Check token chưa expire
4. Regenerate token mới
```

**Issue 2: Streak không tăng**
```
Solution:
1. Log lastStudyDate và today
2. Check timezone (setHours(0,0,0,0))
3. Check logic isYesterday
4. Check có gọi updateStreak không
```

**Issue 3: Query chậm**
```
Solution:
1. Check indexes: db.collection.getIndexes()
2. Explain query: .explain('executionStats')
3. Thêm select() để giảm data
4. Thêm .lean() nếu không cần Mongoose methods
```

---

## 📞 SUPPORT & CONTRIBUTION

### Liên hệ
- **Authors:** NH and VP
- **Email:** [your-email@example.com]
- **GitHub:** [repository-url]

### Đóng góp
Welcome contributions! Vui lòng:
1. Fork repository
2. Tạo branch mới: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Style
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Comment cho logic phức tạp
- Viết descriptive commit messages

---

## 📜 LICENSE

[MIT License / Your chosen license]

---

## 🎉 KẾT LUẬN

Dự án **English Learning Backend API** cung cấp một hệ thống hoàn chỉnh để:

✅ **Quản lý người dùng** - Authentication, authorization, profile  
✅ **Học từ vựng** - Topics, vocabularies với nhiều thông tin phong phú  
✅ **Quiz system** - Tự động chấm điểm, lưu lịch sử, phân tích sai sót  
✅ **Gamification** - Points, streak, leaderboard để tăng động lực học  
✅ **Thống kê** - Theo dõi tiến độ chi tiết, xem điểm mạnh/yếu  
✅ **Scalable** - Kiến trúc layered, indexes tối ưu, dễ mở rộng  

Hệ thống được thiết kế **an toàn, hiệu quả, dễ bảo trì** và sẵn sàng để tích hợp với Frontend!

---

**Version:** 1.0.0  
**Last Updated:** March 2, 2026  
**Document Status:** Complete & Ready for Development

---
