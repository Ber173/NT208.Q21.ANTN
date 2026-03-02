# 📚 HƯỚNG DẪN HỆ THỐNG QUIZ - WEB HỌC TỪ VỰNG

> Tài liệu này dành cho người mới học Backend - Giải thích từ A-Z

---

## 🎯 TỔNG QUAN HỆ THỐNG

Bạn vừa xây dựng một hệ thống quiz hoàn chỉnh với các tính năng:
- ✅ Lấy từ vựng theo chủ đề
- ✅ Chấm điểm quiz tự động
- ✅ Lưu điểm và cộng dồn
- ✅ Tính streak học hàng ngày
- ✅ Lưu lịch sử làm bài

---

## 📂 CẤU TRÚC FILE ĐÃ TẠO

```
src/
├── models/                    # Database schemas
│   ├── point.model.ts        ✅ Lưu tổng điểm của user
│   ├── streak.model.ts       ✅ Lưu streak học liên tục
│   └── quizResult.model.ts   ✅ Lưu kết quả từng lần làm quiz
│
├── services/                  # Business logic
│   ├── topic.service.ts      ✅ Xử lý logic topics & vocabularies
│   ├── quiz.service.ts       ✅ Xử lý chấm điểm quiz
│   ├── point.service.ts      ✅ Xử lý cộng điểm
│   └── streak.service.ts     ✅ Xử lý streak
│
├── controllers/               # Nhận request, trả response
│   ├── topic.controller.ts   ✅ Controller cho topics
│   └── quiz.controller.ts    ✅ Controller cho quizzes
│
└── routes/v1/                 # Định nghĩa API endpoints
    ├── topic.route.ts        ✅ Routes cho topics
    ├── quiz.route.ts         ✅ Routes cho quizzes
    └── index.ts              ✅ Tổng hợp tất cả routes
```

---

## 🔄 FLOW HOẠT ĐỘNG TỔNG THỂ

### **1️⃣ USER LẤY TỪ VỰNG ĐỂ LÀM QUIZ**

```
Client                 →  Route             →  Controller          →  Service            →  Database
-----                     -----                 ----------              -------                --------
GET /topics/:topicId  →  topic.route.ts   →  topic.controller  →  topic.service    →  Vocabularies
/vocabularies?random=true                     .getVocabularies       .getVocabularies         ↓
&count=10                                                            ByTopic()          Random 10 từ
```

**Giải thích:**
- Client gọi API để lấy 10 từ ngẫu nhiên
- Route nhận request và gọi Controller
- Controller gọi Service để xử lý logic
- Service truy vấn Database và random 10 từ
- Trả về cho Client để hiển thị quiz

---

### **2️⃣ USER LÀM BÀI VÀ SUBMIT**

```
Client                    →  Route           →  Middleware   →  Controller       →  Service
------                        -----               ----------       ----------           -------
POST /quizzes/submit     →  quiz.route.ts  →  protect JWT  →  quiz.controller  →  quiz.service
Body: {                                          (xác thực)      .submitQuiz()       .submitQuiz()
  topicId: "123",
  answers: [...]
}
```

---

### **3️⃣ HỆ THỐNG CHẤM ĐIỂM (Bên trong quiz.service.ts)**

```javascript
// ① Lấy đáp án ĐÚNG từ database (KHÔNG tin client)
const vocabularies = await Vocabulary.find({ _id: { $in: vocabIds } })

// ② Tạo map để tra cứu nhanh
const vocabMap = new Map()
vocabularies.forEach(vocab => {
  vocabMap.set(vocab._id.toString(), vocab)
})

// ③ So sánh từng câu trả lời
userAnswers.forEach(userAns => {
  const vocab = vocabMap.get(userAns.vocabId)
  const correctAnswer = vocab.meaning.toLowerCase().trim()
  const selectedAnswer = userAns.selectedAnswer.toLowerCase().trim()
  const isCorrect = selectedAnswer === correctAnswer
  
  if (isCorrect) correctCount++
})

// ④ Tính điểm
const POINTS_PER_QUESTION = 10
const score = correctCount * POINTS_PER_QUESTION

// ⑤ Lưu kết quả vào database
await QuizResult.create({ user, topic, score, answers })

// ⑥ Cộng điểm cho user
await addPoints(userId, score)

// ⑦ Cập nhật streak
await updateStreak(userId)
```

**❗ QUAN TRỌNG: Tại sao KHÔNG TIN dữ liệu client?**
```javascript
// ❌ SAI - Tin client (client có thể gian lận)
const score = req.body.score  // Client tự tính → Dễ hack!

// ✅ ĐÚNG - Tự tính ở server
const vocabularies = await Vocabulary.find(...)  // Lấy đáp án từ DB
const score = calculateScore(userAnswers, vocabularies)
```

---

## 📊 DATABASE MODELS

### **1. Point Model (point.model.ts)**
```typescript
{
  user: ObjectId,           // Tham chiếu đến User
  totalPoints: 150,         // Tổng điểm tích lũy
  createdAt: Date,
  updatedAt: Date
}
```

**Logic cộng điểm:**
```javascript
// Dùng $inc để cộng dồn
await Point.findOneAndUpdate(
  { user: userId },
  { $inc: { totalPoints: pointsToAdd } },  // Tăng lên pointsToAdd
  { upsert: true }  // Tạo mới nếu chưa có
)
```

---

### **2. Streak Model (streak.model.ts)**
```typescript
{
  user: ObjectId,
  currentStreak: 5,         // Streak hiện tại (5 ngày liên tục)
  longestStreak: 10,        // Streak dài nhất từng đạt được
  lastStudyDate: Date,      // Ngày học gần nhất
  createdAt: Date,
  updatedAt: Date
}
```

**Logic tính streak:**
```javascript
const today = new Date()
today.setHours(0, 0, 0, 0)  // Set về 00:00:00 tránh bug timezone

const lastStudy = new Date(streak.lastStudyDate)
lastStudy.setHours(0, 0, 0, 0)

// Case 1: Đã học hôm nay rồi → không làm gì
if (isSameDay(lastStudy, today)) return

// Case 2: Hôm qua đã học → tăng streak
if (isYesterday(lastStudy, today)) {
  streak.currentStreak += 1
} 
// Case 3: Hôm qua KHÔNG học → reset streak
else {
  streak.currentStreak = 1
}

// Cập nhật longest nếu cần
if (streak.currentStreak > streak.longestStreak) {
  streak.longestStreak = streak.currentStreak
}

streak.lastStudyDate = today
await streak.save()
```

---

### **3. QuizResult Model (quizResult.model.ts)**
```typescript
{
  user: ObjectId,
  topic: ObjectId,
  totalQuestions: 10,
  correctAnswers: 7,
  score: 70,
  answers: [
    {
      vocabId: ObjectId,
      selectedAnswer: "apple",
      correctAnswer: "apple",
      isCorrect: true
    },
    {
      vocabId: ObjectId,
      selectedAnswer: "cat",
      correctAnswer: "dog",
      isCorrect: false
    }
  ],
  createdAt: Date
}
```

---

## 🚀 CÁC API ENDPOINTS

### **1. Lấy danh sách topics**

**Request:**
```http
GET /api/v1/topics?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Topics retrieved successfully",
  "data": {
    "topics": [
      {
        "_id": "123",
        "name": "Animals",
        "description": "Động vật",
        "createdAt": "2024-01-01T00:00:00Z"
      }
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

---

### **2. Lấy từ vựng theo topic (Pagination)**

**Request:**
```http
GET /api/v1/topics/123/vocabularies?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vocabularies": [
      {
        "_id": "v1",
        "word": "dog",
        "meaning": "chó"
      },
      {
        "_id": "v2",
        "word": "cat",
        "meaning": "mèo"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

---

### **3. Lấy từ vựng random (Để làm quiz)**

**Request:**
```http
GET /api/v1/topics/123/vocabularies?random=true&count=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vocabularies": [
      { "_id": "v5", "word": "apple", "meaning": "táo" },
      { "_id": "v12", "word": "book", "meaning": "sách" }
      // ... 10 từ random
    ],
    "isRandom": true,
    "count": 10
  }
}
```

---

### **4. Submit Quiz (Chấm điểm)**

**Request:**
```http
POST /api/v1/quizzes/submit
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "topicId": "123",
  "answers": [
    { "vocabId": "v5", "selectedAnswer": "táo" },
    { "vocabId": "v12", "selectedAnswer": "sách" },
    { "vocabId": "v20", "selectedAnswer": "bút" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "totalQuestions": 10,
    "correctAnswers": 7,
    "score": 70,
    "incorrectAnswers": [
      {
        "vocabId": "v20",
        "word": "pen",
        "yourAnswer": "bút",
        "correctAnswer": "bút chì"
      }
    ],
    "pointsEarned": 70,
    "streak": {
      "currentStreak": 5,
      "longestStreak": 10
    }
  }
}
```

---

### **5. Xem lịch sử làm quiz**

**Request:**
```http
GET /api/v1/quizzes/history?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "_id": "result1",
        "topic": {
          "_id": "123",
          "name": "Animals"
        },
        "totalQuestions": 10,
        "correctAnswers": 7,
        "score": 70,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

## 🧩 GIẢI THÍCH CÁC KHÁI NIỆM

### **1. Tại sao tách thành Route / Controller / Service?**

```
Route         →  Định nghĩa URL và method (GET, POST, PUT, DELETE)
Controller    →  Nhận request, validate input, gọi Service, trả response
Service       →  Chứa business logic (chấm điểm, tính streak, cộng điểm)
Model         →  Cấu trúc dữ liệu trong database
```

**Lợi ích:**
- ✅ Dễ đọc, dễ maintain
- ✅ Tách biệt trách nhiệm (Separation of Concerns)
- ✅ Dễ test từng phần
- ✅ Có thể tái sử dụng Service ở nhiều nơi

---

### **2. Pagination là gì?**

**Vấn đề:** 
Nếu có 1000 từ vựng, trả về hết 1 lần → chậm, tốn băng thông

**Giải pháp:** 
Chia nhỏ thành từng trang (page), mỗi trang 20 từ

```javascript
const page = 1
const limit = 20
const skip = (page - 1) * limit  // Bỏ qua bao nhiêu record

// Page 1: skip 0,  lấy từ 1-20
// Page 2: skip 20, lấy từ 21-40
// Page 3: skip 40, lấy từ 41-60
```

---

### **3. Middleware là gì?**

**Định nghĩa:**
Middleware là hàm chạy TRƯỚC khi request đến Controller

```javascript
router.post('/submit', protect, quizController.submitQuiz)
                       ↑
                  Middleware xác thực JWT
                  Chạy trước controller
```

**Flow:**
```
Request → Middleware (protect) → Controller → Service → Database
            ↓
       Kiểm tra JWT
       Nếu không hợp lệ → return lỗi
       Nếu hợp lệ → gắn user vào req.user → next()
```

---

### **4. upsert: true là gì?**

```javascript
await Point.findOneAndUpdate(
  { user: userId },
  { $inc: { totalPoints: 10 } },
  { upsert: true }  // ← Quan trọng!
)
```

**Giải thích:**
- Nếu tìm thấy record → Update
- Nếu KHÔNG tìm thấy → Insert (tạo mới)

**Dùng khi nào?**
- User làm quiz lần đầu → chưa có record điểm → tạo mới
- User làm quiz lần 2 → đã có record → cộng dồn

---

## ⚙️ CÁCH CHẠY & TEST

### **1. Cài đặt dependencies**
```bash
npm install
```

### **2. Chạy server**
```bash
npm run dev
```

### **3. Test API bằng Postman/Thunder Client**

**Bước 1: Login để lấy JWT token**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

→ Copy token từ response
```

**Bước 2: Lấy danh sách topics**
```http
GET /api/v1/topics
```

**Bước 3: Lấy 10 từ random để làm quiz**
```http
GET /api/v1/topics/123/vocabularies?random=true&count=10
```

**Bước 4: Submit quiz**
```http
POST /api/v1/quizzes/submit
Authorization: Bearer <PASTE_TOKEN_HERE>
Content-Type: application/json

{
  "topicId": "123",
  "answers": [
    { "vocabId": "v1", "selectedAnswer": "chó" },
    { "vocabId": "v2", "selectedAnswer": "mèo" }
  ]
}
```

**Bước 5: Xem lịch sử**
```http
GET /api/v1/quizzes/history
Authorization: Bearer <TOKEN>
```

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### **Lỗi 1: "Not authorized to access this route"**
**Nguyên nhân:** Không gửi JWT token hoặc token không hợp lệ

**Giải pháp:**
```http
Authorization: Bearer <token_của_bạn>
```

---

### **Lỗi 2: "Invalid request. Please provide topicId and answers array"**
**Nguyên nhân:** Request body thiếu field

**Giải pháp:** Kiểm tra body phải có đúng format:
```json
{
  "topicId": "...",
  "answers": [...]
}
```

---

### **Lỗi 3: Timezone bug (Streak không đúng)**
**Nguyên nhân:** So sánh ngày có kèm giờ

**Giải pháp:** Set giờ về 00:00:00
```javascript
const today = new Date()
today.setHours(0, 0, 0, 0)  // ← Quan trọng!
```

---

## 📝 TÓM TẮT FLOW HOẠT ĐỘNG

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User lấy 10 từ random để làm quiz                        │
│    GET /topics/:topicId/vocabularies?random=true&count=10   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User làm bài và submit answers                           │
│    POST /quizzes/submit                                     │
│    { topicId, answers: [...] }                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Server chấm điểm                                         │
│    - Lấy đáp án đúng từ DB                                  │
│    - So sánh từng câu trả lời                               │
│    - Tính điểm (correctAnswers * 10)                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Lưu kết quả vào QuizResult                               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Cộng điểm vào Point (upsert)                             │
│    Point.findOneAndUpdate({ $inc: totalPoints })            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Cập nhật Streak                                          │
│    - Nếu hôm qua học → streak + 1                           │
│    - Nếu hôm qua không học → reset = 1                      │
│    - Nếu hôm nay đã học rồi → không làm gì                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Trả về kết quả cho Client                                │
│    { totalQuestions, correctAnswers, score,                 │
│      incorrectAnswers, pointsEarned, streak }               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 BÀI TẬP THỰC HÀNH

### **Bài 1: Tăng số điểm mỗi câu lên 20**
Tìm và sửa constant `POINTS_PER_QUESTION` trong [quiz.service.ts](src/services/quiz.service.ts#L60)

### **Bài 2: Thêm validation - phải làm đủ 5 câu mới được submit**
Thêm check trong [quiz.controller.ts](src/controllers/quiz.controller.ts)

### **Bài 3: Thêm API lấy top 10 users có điểm cao nhất**
Tạo service mới, query `Point.find().sort({ totalPoints: -1 }).limit(10)`

### **Bài 4: Thêm bonus điểm nếu streak >= 7 ngày**
Sửa logic trong [quiz.service.ts](src/services/quiz.service.ts) - cộng thêm 20% điểm

---

## 🚀 NÂNG CAO (Tính năng mở rộng)

1. **Leaderboard (Bảng xếp hạng)**
   - Truy vấn top users theo điểm
   - Hiển thị rank của user hiện tại

2. **Daily Reward**
   - Giữ streak 7 ngày → tặng 100 điểm bonus
   - Reset mỗi tuần

3. **Achievement System**
   - "First Blood": Hoàn thành quiz đầu tiên
   - "Perfect Score": Đúng 100% câu hỏi
   - "Consistent Learner": Streak 30 ngày

4. **Quiz Timer**
   - Giới hạn thời gian làm bài
   - Lưu thời gian hoàn thành

5. **Topic Progress**
   - Track số từ đã học trong mỗi topic
   - Hiển thị % hoàn thành

---

## 📚 TÀI LIỆU THAM KHẢO

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication](https://jwt.io/introduction)
- [MongoDB Aggregation](https://www.mongodb.com/docs/manual/aggregation/)

---

## ✅ CHECKLIST HOÀN THÀNH

- [x] Models: Point, Streak, QuizResult
- [x] Services: topic, quiz, point, streak
- [x] Controllers: topic, quiz
- [x] Routes: topic, quiz
- [x] API lấy topics với pagination
- [x] API lấy vocabularies với pagination + random
- [x] API submit quiz và chấm điểm
- [x] Lưu điểm với upsert
- [x] Cập nhật streak với logic ngày
- [x] API lịch sử làm quiz
- [x] JWT authentication cho quiz endpoints

---

## 💬 HỖ TRỢ

Nếu gặp lỗi hoặc có thắc mắc:
1. Kiểm tra console log xem lỗi ở đâu
2. Dùng `console.log()` để debug
3. Test từng API một bằng Postman
4. Kiểm tra MongoDB có data chưa

---

**Chúc bạn học tốt! 🚀**
