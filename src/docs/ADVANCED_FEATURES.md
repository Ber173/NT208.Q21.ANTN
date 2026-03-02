# 🚀 TÍNH NĂNG MỞ RỘNG - LEADERBOARD & STATS

> Tài liệu hướng dẫn sử dụng các tính năng nâng cao đã được tối ưu

---

## 📋 MỤC LỤC

1. [Các Thay Đổi Đã Thực Hiện](#các-thay-đổi-đã-thực-hiện)
2. [Leaderboard System](#leaderboard-system)
3. [Statistics System](#statistics-system)
4. [Multiple Choice Quiz](#multiple-choice-quiz)
5. [Cách Tích Hợp](#cách-tích-hợp)
6. [API Examples](#api-examples)

---

## ✅ CÁC THAY ĐỔI ĐÃ THỰC HIỆN

### **1. Sửa Warning Duplicate Index**

**Vấn đề:** Field `user` trong Point và Streak models có `unique: true` (tự động tạo index) + thêm `schema.index({ user: 1 })` → duplicate!

**Giải pháp:** Xóa dòng `schema.index({ user: 1 })` vì `unique: true` đã tự động tạo index.

```typescript
// ❌ TRƯỚC (có warning)
const schema = new Schema({
  user: { type: ObjectId, unique: true }
})
schema.index({ user: 1 }) // ← Duplicate!

// ✅ SAU (không warning)
const schema = new Schema({
  user: { type: ObjectId, unique: true } // Unique tự tạo index
})
// Xóa dòng index trùng lặp
```

---

### **2. Mở Rộng Models**

#### **Point Model**
Thêm fields để hỗ trợ leaderboard tuần/tháng:

```typescript
{
  user: ObjectId,
  totalPoints: 150,        // Tổng điểm tích lũy
  weeklyPoints: 50,        // Điểm trong tuần này
  monthlyPoints: 120,      // Điểm trong tháng này
  lastWeekReset: Date,     // Lần reset điểm tuần gần nhất
  lastMonthReset: Date,    // Lần reset điểm tháng gần nhất
}
```

**Indexes mới:**
- `{ totalPoints: -1 }` - Leaderboard tổng
- `{ weeklyPoints: -1 }` - Leaderboard tuần
- `{ monthlyPoints: -1 }` - Leaderboard tháng

---

#### **Streak Model**
Thêm field để thống kê:

```typescript
{
  user: ObjectId,
  currentStreak: 5,
  longestStreak: 10,
  lastStudyDate: Date,
  totalDaysStudied: 25     // ✨ MỚI: Tổng số ngày đã học
}
```

**Indexes mới:**
- `{ longestStreak: -1 }` - Leaderboard longest streak
- `{ currentStreak: -1 }` - Leaderboard current streak

---

#### **Vocabulary Model**
Thêm fields để hỗ trợ multiple choice và nội dung phong phú:

```typescript
{
  word: "apple",
  meaning: "táo",
  pronunciation: "/ˈæp.əl/",    // ✨ MỚI: Phát âm IPA
  example: "I eat an apple",    // ✨ MỚI: Câu ví dụ
  imageUrl: "https://...",      // ✨ MỚI: Ảnh minh họa
  audioUrl: "https://...",      // ✨ MỚI: File âm thanh
  choices: [                    // ✨ MỚI: Đáp án sai cho multiple choice
    "cam",
    "chuối", 
    "xoài"
  ],
  difficulty: "easy",           // ✨ MỚI: easy/medium/hard
  topic: ObjectId
}
```

**Indexes mới:**
- `{ topic: 1 }` - Filter theo topic
- `{ difficulty: 1 }` - Filter theo độ khó
- `{ word: 'text', meaning: 'text' }` - Text search

---

#### **QuizResult Model**
Thêm fields để tracking time và loại quiz:

```typescript
{
  user: ObjectId,
  topic: ObjectId,
  quizType: "text",             // ✨ MỚI: text | multiple_choice
  totalQuestions: 10,
  correctAnswers: 7,
  score: 70,
  completionTime: 120,          // ✨ MỚI: Thời gian hoàn thành (giây)
  answers: [
    {
      vocabId: ObjectId,
      selectedAnswer: "táo",
      correctAnswer: "táo",
      isCorrect: true,
      timeSpent: 5              // ✨ MỚI: Thời gian làm câu này (giây)
    }
  ]
}
```

**Indexes mới:**
- `{ completionTime: 1 }` - Leaderboard fastest
- `{ quizType: 1 }` - Filter theo loại quiz
- `{ createdAt: -1 }` - Stats theo thời gian

---

## 🏆 LEADERBOARD SYSTEM

### **Các Loại Leaderboard**

#### **1. Total Points Leaderboard**
Top users theo tổng điểm tích lũy (mọi thời điểm)

```typescript
// Service
import * as leaderboardService from '~/services/leaderboard.service'

const result = await leaderboardService.getTotalPointsLeaderboard({
  page: 1,
  limit: 10
})

// Response
{
  leaderboard: [
    {
      rank: 1,
      user: { _id: "...", username: "john_doe", email: "..." },
      totalPoints: 1500
    },
    {
      rank: 2,
      user: { _id: "...", username: "jane_smith", email: "..." },
      totalPoints: 1200
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
}
```

---

#### **2. Weekly Leaderboard**
Top users trong tuần này (tự động reset mỗi tuần)

```typescript
const result = await leaderboardService.getWeeklyLeaderboard({
  page: 1,
  limit: 10
})

// Response
{
  leaderboard: [
    {
      rank: 1,
      user: { ... },
      weeklyPoints: 350
    }
  ]
}
```

---

#### **3. Monthly Leaderboard**
Top users trong tháng này (tự động reset mỗi tháng)

```typescript
const result = await leaderboardService.getMonthlyLeaderboard({
  page: 1,
  limit: 10
})
```

---

#### **4. Streak Leaderboard**
Top users theo streak hiện tại

```typescript
const result = await leaderboardService.getStreakLeaderboard({
  page: 1,
  limit: 10
})

// Response
{
  leaderboard: [
    {
      rank: 1,
      user: { ... },
      currentStreak: 30,
      longestStreak: 45
    }
  ]
}
```

---

#### **5. Fastest Quiz Completion**
Top users hoàn thành quiz nhanh nhất (theo topic)

```typescript
const result = await leaderboardService.getFastestQuizLeaderboard(
  'topicId123',
  { page: 1, limit: 10 }
)

// Response
{
  leaderboard: [
    {
      rank: 1,
      user: { ... },
      fastestTime: 45, // seconds
      score: 100,
      date: "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

#### **6. Get User's Rank**
Tìm vị trí của user trong leaderboard

```typescript
const rank = await leaderboardService.getUserRank(
  userId,
  'total' // 'total' | 'weekly' | 'monthly' | 'streak'
)

// Response
{
  rank: 15,
  value: 850, // điểm hoặc streak
  type: "total"
}
```

---

## 📊 STATISTICS SYSTEM

### **1. Overall Stats**
Thống kê tổng quan

```typescript
import * as statsService from '~/services/stats.service'

const stats = await statsService.getUserOverallStats(userId)

// Response
{
  points: {
    total: 1500,
    weekly: 350,
    monthly: 800
  },
  streak: {
    current: 7,
    longest: 15,
    totalDays: 45
  },
  quiz: {
    totalCompleted: 50,
    totalQuestions: 500,
    totalCorrect: 420,
    accuracy: 84.0,
    totalScore: 4200,
    avgCompletionTime: 90 // seconds
  }
}
```

---

### **2. Weekly Stats**
Thống kê 7 ngày gần nhất (mỗi ngày)

```typescript
const stats = await statsService.getWeeklyStats(userId)

// Response
{
  period: "week",
  from: "2024-01-08",
  to: "2024-01-15",
  dailyStats: [
    {
      date: "2024-01-08",
      quizzesCompleted: 3,
      score: 270,
      accuracy: 90.0
    },
    {
      date: "2024-01-09",
      quizzesCompleted: 2,
      score: 160,
      accuracy: 80.0
    },
    // ... 7 ngày
  ]
}
```

---

### **3. Monthly Stats**
Thống kê 30 ngày gần nhất (theo tuần)

```typescript
const stats = await statsService.getMonthlyStats(userId)

// Response
{
  period: "month",
  from: "2023-12-15",
  to: "2024-01-15",
  weeklyStats: [
    {
      week: "Week 50",
      year: 2023,
      quizzesCompleted: 12,
      score: 1080,
      accuracy: 85.5
    }
    // ... 4 tuần
  ]
}
```

---

### **4. Topic Stats**
Tiến độ học theo từng chủ đề

```typescript
const stats = await statsService.getTopicStats(userId)

// Response
{
  topics: [
    {
      topic: { _id: "...", name: "Animals" },
      quizzesCompleted: 10,
      totalScore: 850,
      accuracy: 85.0,
      bestScore: 100,
      avgScore: 85.0
    },
    {
      topic: { _id: "...", name: "Food" },
      quizzesCompleted: 8,
      totalScore: 640,
      accuracy: 80.0,
      bestScore: 90,
      avgScore: 80.0
    }
  ]
}
```

---

### **5. Quiz Type Comparison**
So sánh Text vs Multiple Choice

```typescript
const stats = await statsService.getQuizTypeStats(userId)

// Response
{
  text: {
    quizzesCompleted: 30,
    totalScore: 2400,
    accuracy: 80.0,
    avgCompletionTime: 120
  },
  multiple_choice: {
    quizzesCompleted: 20,
    totalScore: 1800,
    accuracy: 90.0,
    avgCompletionTime: 60
  }
}
```

---

### **6. Recent Activity**
Hoạt động gần đây

```typescript
const activity = await statsService.getRecentActivity(userId, 10)

// Response
{
  recentQuizzes: [
    {
      topic: { _id: "...", name: "Animals" },
      score: 90,
      accuracy: 90.0,
      quizType: "multiple_choice",
      date: "2024-01-15T10:30:00Z"
    }
    // ... 10 quiz gần nhất
  ]
}
```

---

## 🎯 MULTIPLE CHOICE QUIZ

### **Cách Hoạt Động**

#### **1. Chuẩn Bị Vocabulary**
Thêm `choices` (đáp án sai) vào vocabulary:

```typescript
// Thêm từ vựng với multiple choice
{
  word: "apple",
  meaning: "táo",
  choices: ["cam", "chuối", "xoài"], // 3 đáp án sai
  difficulty: "easy"
}
```

#### **2. Lấy Quiz với Multiple Choice**
Client request random vocabularies:

```http
GET /api/v1/topics/123/vocabularies?random=true&count=10
```

Response sẽ bao gồm `choices`:

```json
{
  "vocabularies": [
    {
      "_id": "v1",
      "word": "apple",
      "meaning": "táo",
      "choices": ["cam", "chuối", "xoài"]
    }
  ]
}
```

#### **3. Frontend Tạo Multiple Choice**
```javascript
// Frontend logic
const createMultipleChoice = (vocab) => {
  // Kết hợp đáp án đúng + đáp án sai
  const options = [
    vocab.meaning,           // Đáp án đúng
    ...vocab.choices         // 3 đáp án sai
  ]
  
  // Shuffle random
  return shuffle(options)
}
```

#### **4. Submit Quiz**
```http
POST /api/v1/quizzes/submit
{
  "topicId": "123",
  "quizType": "multiple_choice",  // ✨ Chỉ định loại quiz
  "completionTime": 120,           // ✨ Thời gian hoàn thành
  "answers": [
    {
      "vocabId": "v1",
      "selectedAnswer": "táo",
      "timeSpent": 5               // ✨ Thời gian làm câu này
    }
  ]
}
```

---

## 🔧 CÁCH TÍCH HỢP

### **Bước 1: Cập nhật Quiz Service**

Mở [quiz.service.ts](../services/quiz.service.ts) và cập nhật `submitQuiz`:

```typescript
export const submitQuiz = async (
  userId: string,
  topicId: string,
  userAnswers: UserAnswer[],
  quizType: 'text' | 'multiple_choice' = 'text',  // ✨ Thêm param
  completionTime?: number                          // ✨ Thêm param
) => {
  // ... logic chấm điểm như cũ ...

  // Lưu kết quả với info mới
  await QuizResult.create({
    user: userId,
    topic: topicId,
    quizType,                 // ✨ Lưu loại quiz
    completionTime,           // ✨ Lưu thời gian
    // ... các field khác
  })
}
```

### **Bước 2: Tạo Controllers**

Tạo [leaderboard.controller.ts](../controllers/leaderboard.controller.ts):

```typescript
import * as leaderboardService from '~/services/leaderboard.service'

export const getTotalLeaderboard = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  
  const result = await leaderboardService.getTotalPointsLeaderboard({
    page,
    limit
  })
  
  res.json({ success: true, data: result })
}

export const getWeeklyLeaderboard = async (req, res) => {
  // Similar
}

export const getUserRank = async (req, res) => {
  const userId = req.user._id
  const type = req.query.type || 'total'
  
  const rank = await leaderboardService.getUserRank(userId, type)
  
  res.json({ success: true, data: rank })
}
```

Tạo [stats.controller.ts](../controllers/stats.controller.ts):

```typescript
import * as statsService from '~/services/stats.service'

export const getOverallStats = async (req, res) => {
  const userId = req.user._id
  
  const stats = await statsService.getUserOverallStats(userId)
  
  res.json({ success: true, data: stats })
}

export const getWeeklyStats = async (req, res) => {
  // Similar
}
```

### **Bước 3: Tạo Routes**

Tạo [leaderboard.route.ts](../routes/v1/leaderboard.route.ts):

```typescript
import { Router } from 'express'
import * as leaderboardController from '~/controllers/leaderboard.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

// Public leaderboards
router.get('/total', leaderboardController.getTotalLeaderboard)
router.get('/weekly', leaderboardController.getWeeklyLeaderboard)
router.get('/monthly', leaderboardController.getMonthlyLeaderboard)
router.get('/streak', leaderboardController.getStreakLeaderboard)

// Private - User's rank
router.get('/my-rank', protect, leaderboardController.getUserRank)

export default router
```

Tạo [stats.route.ts](../routes/v1/stats.route.ts):

```typescript
import { Router } from 'express'
import * as statsController from '~/controllers/stats.controller'
import { protect } from '~/middlewares/auth.middleware'

const router = Router()

// All stats routes require authentication
router.use(protect)

router.get('/overall', statsController.getOverallStats)
router.get('/weekly', statsController.getWeeklyStats)
router.get('/monthly', statsController.getMonthlyStats)
router.get('/topics', statsController.getTopicStats)
router.get('/quiz-types', statsController.getQuizTypeComparison)
router.get('/recent', statsController.getRecentActivity)

export default router
```

### **Bước 4: Đăng Ký Routes**

Cập nhật [routes/v1/index.ts](../routes/v1/index.ts):

```typescript
import leaderboardRoutes from './leaderboard.route'
import statsRoutes from './stats.route'

// Thêm vào router
router.use('/leaderboard', leaderboardRoutes)
router.use('/stats', statsRoutes)
```

---

## 📡 API EXAMPLES

### **Leaderboard APIs**

```http
# 1. Total Points Leaderboard
GET /api/v1/leaderboard/total?page=1&limit=10

# 2. Weekly Leaderboard
GET /api/v1/leaderboard/weekly?page=1&limit=10

# 3. Monthly Leaderboard
GET /api/v1/leaderboard/monthly?page=1&limit=10

# 4. Streak Leaderboard
GET /api/v1/leaderboard/streak?page=1&limit=10

# 5. My Rank (cần JWT)
GET /api/v1/leaderboard/my-rank?type=total
Authorization: Bearer <token>
```

### **Stats APIs**

```http
# 1. Overall Stats (cần JWT)
GET /api/v1/stats/overall
Authorization: Bearer <token>

# 2. Weekly Stats
GET /api/v1/stats/weekly
Authorization: Bearer <token>

# 3. Monthly Stats
GET /api/v1/stats/monthly
Authorization: Bearer <token>

# 4. Topic Stats
GET /api/v1/stats/topics
Authorization: Bearer <token>

# 5. Quiz Type Comparison
GET /api/v1/stats/quiz-types
Authorization: Bearer <token>

# 6. Recent Activity
GET /api/v1/stats/recent?limit=10
Authorization: Bearer <token>
```

---

## 🎨 FRONTEND INTEGRATION EXAMPLES

### **React Component - Leaderboard**

```jsx
import { useState, useEffect } from 'react'

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [type, setType] = useState('total') // total, weekly, monthly
  
  useEffect(() => {
    fetch(`/api/v1/leaderboard/${type}?page=1&limit=10`)
      .then(res => res.json())
      .then(data => setLeaderboard(data.data.leaderboard))
  }, [type])
  
  return (
    <div>
      <h2>🏆 Leaderboard</h2>
      <select onChange={(e) => setType(e.target.value)}>
        <option value="total">All Time</option>
        <option value="weekly">This Week</option>
        <option value="monthly">This Month</option>
        <option value="streak">Streak</option>
      </select>
      
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(entry => (
            <tr key={entry.rank}>
              <td>{entry.rank}</td>
              <td>{entry.user.username}</td>
              <td>{entry.totalPoints || entry.weeklyPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### **React Component - Stats Dashboard**

```jsx
function StatsDashboard() {
  const [stats, setStats] = useState(null)
  
  useEffect(() => {
    fetch('/api/v1/stats/overall', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setStats(data.data))
  }, [])
  
  if (!stats) return <div>Loading...</div>
  
  return (
    <div>
      <h2>📊 Your Stats</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Points</h3>
          <p>{stats.points.total}</p>
        </div>
        
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p>{stats.streak.current} days 🔥</p>
        </div>
        
        <div className="stat-card">
          <h3>Accuracy</h3>
          <p>{stats.quiz.accuracy}%</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Quizzes</h3>
          <p>{stats.quiz.totalCompleted}</p>
        </div>
      </div>
    </div>
  )
}
```

---

## 📝 NOTES

### **Auto Reset Logic**

Điểm tuần/tháng được reset tự động khi user làm quiz:

```typescript
// Trong point.service.ts
const needWeeklyReset = (lastReset) => {
  const daysSince = calculateDays(lastReset, now)
  return daysSince >= 7
}

const needMonthlyReset = (lastReset) => {
  return now.getMonth() !== lastReset.getMonth()
}
```

### **Performance Optimization**

- Tất cả queries có indexes phù hợp
- Leaderboard dùng `.lean()` để trả về plain objects (nhanh hơn)
- Stats dùng aggregation pipeline (tối ưu)
- Pagination ở tất cả APIs

### **Extensibility**

Dễ dàng thêm:
- Achievements system → Track milestones
- Daily rewards → Bonus điểm
- Topic progress → % completion
- Quiz difficulty → Dynamic scoring

---

**Tài liệu này cung cấp đầy đủ thông tin để triển khai Leaderboard & Stats! 🚀**
