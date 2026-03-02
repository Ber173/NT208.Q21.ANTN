# 🏗️ SƠ ĐỒ KIẾN TRÚC HỆ THỐNG - WEB HỌC TIẾNG ANH

> **English Learning Platform** - System Architecture Documentation  
> **Version:** 1.0.0  
> **Last Updated:** March 2, 2026

---

## 📋 MỤC LỤC

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [Kiến Trúc Backend Chi Tiết](#2-kiến-trúc-backend-chi-tiết)
3. [Database Schema & Relationships](#3-database-schema--relationships)
4. [API Request Flow](#4-api-request-flow)
5. [Module Chính & Chức Năng](#5-module-chính--chức-năng)
6. [Security Architecture](#6-security-architecture)
7. [Data Flow Diagrams](#7-data-flow-diagrams)

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1. Sơ Đồ Tổng Quan Hệ Thống

```mermaid
graph TB
    subgraph "CLIENT LAYER"
        WEB[Web Browser<br/>React/Vue/Angular]
        MOBILE[Mobile App<br/>React Native/Flutter]
    end

    subgraph "API GATEWAY"
        NGINX[Nginx/Load Balancer<br/>Port 80/443]
    end

    subgraph "BACKEND SERVER - Node.js"
        API[Express API Server<br/>Port 5000]
        
        subgraph "Middleware Layer"
            CORS[CORS Handler]
            AUTH[JWT Auth<br/>Middleware]
            VALIDATOR[Request<br/>Validator]
            ERROR[Error<br/>Handler]
        end
        
        subgraph "Application Layer"
            ROUTES[Routes<br/>API Endpoints]
            CONTROLLERS[Controllers<br/>Request/Response]
            SERVICES[Services<br/>Business Logic]
        end
        
        subgraph "Data Access Layer"
            MODELS[Mongoose Models<br/>ODM]
        end
    end

    subgraph "DATABASE LAYER"
        MONGODB[(MongoDB<br/>NoSQL Database)]
        REDIS[(Redis Cache<br/>Session/Cache)]
    end

    subgraph "EXTERNAL SERVICES"
        AI[AI Services<br/>• OpenAI API<br/>• Text-to-Speech<br/>• Speech Recognition]
        STORAGE[Cloud Storage<br/>• AWS S3<br/>• Cloudinary<br/>Images/Audio]
        EMAIL[Email Service<br/>• SendGrid<br/>• AWS SES]
        PAYMENT[Payment Gateway<br/>• Stripe<br/>• PayPal]
    end

    subgraph "MONITORING & ANALYTICS"
        LOG[Logging<br/>Winston/Morgan]
        MONITOR[Monitoring<br/>Prometheus/Grafana]
        ANALYTICS[Analytics<br/>Google Analytics]
    end

    %% Client connections
    WEB --> NGINX
    MOBILE --> NGINX
    
    %% NGINX to API
    NGINX --> API
    
    %% API internal flow
    API --> CORS
    CORS --> AUTH
    AUTH --> VALIDATOR
    VALIDATOR --> ROUTES
    ROUTES --> CONTROLLERS
    CONTROLLERS --> SERVICES
    SERVICES --> MODELS
    
    %% Models to Database
    MODELS --> MONGODB
    MODELS --> REDIS
    
    %% Services to External
    SERVICES -.->|AI Features| AI
    SERVICES -.->|Upload Media| STORAGE
    SERVICES -.->|Send Emails| EMAIL
    SERVICES -.->|Process Payment| PAYMENT
    
    %% Error handling
    VALIDATOR --> ERROR
    CONTROLLERS --> ERROR
    SERVICES --> ERROR
    
    %% Monitoring
    API --> LOG
    API --> MONITOR
    WEB --> ANALYTICS

    style WEB fill:#4CAF50
    style MOBILE fill:#4CAF50
    style API fill:#2196F3
    style MONGODB fill:#47A248
    style REDIS fill:#DC382D
    style AI fill:#FF9800
    style STORAGE fill:#FF9800
```

### 1.2. Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React/Vue/Angular | User Interface |
| **Mobile** | React Native/Flutter | Mobile App |
| **Backend** | Node.js + Express + TypeScript | REST API Server |
| **Database** | MongoDB | Primary Data Storage |
| **Cache** | Redis | Session & Cache |
| **Authentication** | JWT | Stateless Auth |
| **File Storage** | AWS S3 / Cloudinary | Images & Audio |
| **AI Services** | OpenAI / Google Cloud AI | AI Features |
| **Deployment** | Docker + AWS/Heroku | Cloud Hosting |

---

## 2. KIẾN TRÚC BACKEND CHI TIẾT

### 2.1. Layered Architecture (3-Tier)

```mermaid
graph TB
    subgraph "PRESENTATION LAYER"
        R1[Routes<br/>API Routing]
        C1[Controllers<br/>Request Handler]
    end

    subgraph "BUSINESS LOGIC LAYER"
        S1[Auth Service<br/>Login/Register/JWT]
        S2[Quiz Service<br/>Grading/Scoring]
        S3[Point Service<br/>Points Management]
        S4[Streak Service<br/>Streak Calculation]
        S5[Topic Service<br/>Topics/Vocabularies]
        S6[Stats Service<br/>Statistics/Analytics]
        S7[Leaderboard Service<br/>Rankings]
        S8[User Service<br/>User Management]
    end

    subgraph "DATA ACCESS LAYER"
        M1[(User Model)]
        M2[(Topic Model)]
        M3[(Vocabulary Model)]
        M4[(Quiz Model)]
        M5[(QuizResult Model)]
        M6[(Point Model)]
        M7[(Streak Model)]
        M8[(Purchase Model)]
        M9[(ShopItem Model)]
    end

    subgraph "DATABASE"
        DB[(MongoDB<br/>Collections)]
    end

    R1 --> C1
    C1 --> S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8
    
    S1 --> M1
    S2 --> M3 & M4 & M5 & M6 & M7
    S3 --> M6
    S4 --> M7
    S5 --> M2 & M3
    S6 --> M5 & M6 & M7
    S7 --> M6 & M7
    S8 --> M1
    
    M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8 & M9 --> DB

    style R1 fill:#E3F2FD
    style C1 fill:#BBDEFB
    style S1 fill:#90CAF9
    style S2 fill:#90CAF9
    style S3 fill:#90CAF9
    style S4 fill:#90CAF9
    style S5 fill:#90CAF9
    style S6 fill:#90CAF9
    style S7 fill:#90CAF9
    style S8 fill:#90CAF9
    style DB fill:#4CAF50
```

### 2.2. Folder Structure

```
backend/
│
├── src/
│   ├── server.ts                 # Entry Point
│   │
│   ├── config/                   # Configuration Module
│   │   ├── database.ts           # MongoDB Connection
│   │   ├── cors.ts              # CORS Settings
│   │   └── environment.ts        # Environment Variables
│   │
│   ├── models/                   # Data Models (ODM)
│   │   ├── user.model.ts
│   │   ├── topic.model.ts
│   │   ├── vocabulary.model.ts
│   │   ├── quiz.model.ts
│   │   ├── quizResult.model.ts
│   │   ├── point.model.ts
│   │   ├── streak.model.ts
│   │   ├── streakLog.model.ts
│   │   ├── userProgress.model.ts
│   │   ├── shopItem.model.ts
│   │   └── purchase.model.ts
│   │
│   ├── controllers/              # Request Handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── topic.controller.ts
│   │   └── quiz.controller.ts
│   │
│   ├── services/                 # Business Logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── topic.service.ts
│   │   ├── quiz.service.ts
│   │   ├── point.service.ts
│   │   ├── streak.service.ts
│   │   ├── stats.service.ts
│   │   └── leaderboard.service.ts
│   │
│   ├── middlewares/              # Middleware Functions
│   │   └── auth.middleware.ts    # JWT Verification
│   │
│   ├── routes/v1/                # API Routes
│   │   ├── index.ts             # Route Aggregator
│   │   ├── auth.route.ts
│   │   ├── user.route.ts
│   │   ├── topic.route.ts
│   │   └── quiz.route.ts
│   │
│   ├── utils/                    # Utility Functions
│   │   ├── algorithms.ts
│   │   ├── constants.ts
│   │   └── sorts.ts
│   │
│   └── docs/                     # Documentation
│       ├── QUIZ_SYSTEM_GUIDE.md
│       ├── ADVANCED_FEATURES.md
│       ├── FRONTEND_INTEGRATION.md
│       └── SYSTEM_ARCHITECTURE.md
│
├── package.json
├── tsconfig.json
└── .env
```

---

## 3. DATABASE SCHEMA & RELATIONSHIPS

### 3.1. Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ QUIZ_RESULT : completes
    USER ||--o| POINT : has
    USER ||--o| STREAK : has
    USER ||--o{ STREAK_LOG : tracks
    USER ||--o{ USER_PROGRESS : learns
    USER ||--o{ PURCHASE : makes
    
    TOPIC ||--o{ VOCABULARY : contains
    TOPIC ||--o{ QUIZ : has
    TOPIC ||--o{ QUIZ_RESULT : belongs_to
    TOPIC ||--o{ USER_PROGRESS : tracked_in
    
    VOCABULARY }o--|| TOPIC : belongs_to
    VOCABULARY }o--o{ QUIZ_RESULT : answered_in
    
    QUIZ }o--|| TOPIC : belongs_to
    
    QUIZ_RESULT }o--|| USER : completed_by
    QUIZ_RESULT }o--|| TOPIC : belongs_to
    
    SHOP_ITEM ||--o{ PURCHASE : purchased_as
    
    PURCHASE }o--|| USER : made_by
    PURCHASE }o--|| SHOP_ITEM : for

    USER {
        ObjectId _id PK
        string username UK
        string email UK
        string password
        number points
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    TOPIC {
        ObjectId _id PK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }

    VOCABULARY {
        ObjectId _id PK
        string word
        string meaning
        string pronunciation
        string example
        string imageUrl
        string audioUrl
        ObjectId topic FK
        array choices
        enum difficulty
        datetime createdAt
        datetime updatedAt
    }

    QUIZ {
        ObjectId _id PK
        ObjectId topic FK
        string title
        datetime createdAt
        datetime updatedAt
    }

    QUIZ_RESULT {
        ObjectId _id PK
        ObjectId user FK
        ObjectId topic FK
        number totalQuestions
        number correctAnswers
        number score
        array answers
        number completionTime
        datetime createdAt
        datetime updatedAt
    }

    POINT {
        ObjectId _id PK
        ObjectId user FK
        number totalPoints
        number weeklyPoints
        number monthlyPoints
        datetime lastWeekReset
        datetime lastMonthReset
        datetime createdAt
        datetime updatedAt
    }

    STREAK {
        ObjectId _id PK
        ObjectId user FK
        number currentStreak
        number longestStreak
        datetime lastStudyDate
        number totalDaysStudied
        datetime createdAt
        datetime updatedAt
    }

    STREAK_LOG {
        ObjectId _id PK
        ObjectId user FK
        datetime date
        number activitiesCount
        datetime createdAt
    }

    USER_PROGRESS {
        ObjectId _id PK
        ObjectId user FK
        ObjectId topic FK
        number masteredWords
        number totalWords
        datetime lastStudied
        datetime createdAt
        datetime updatedAt
    }

    SHOP_ITEM {
        ObjectId _id PK
        string name
        number price
        datetime createdAt
        datetime updatedAt
    }

    PURCHASE {
        ObjectId _id PK
        ObjectId user FK
        ObjectId item FK
        number price
        datetime createdAt
    }
```

### 3.2. Database Indexes Strategy

```mermaid
graph LR
    subgraph "User Collection Indexes"
        U1[email: unique]
        U2[username: unique]
    end

    subgraph "Point Collection Indexes"
        P1[user: unique]
        P2[totalPoints: -1]
        P3[weeklyPoints: -1]
        P4[monthlyPoints: -1]
    end

    subgraph "Streak Collection Indexes"
        S1[user: unique]
        S2[longestStreak: -1]
        S3[currentStreak: -1]
    end

    subgraph "Vocabulary Collection Indexes"
        V1[topic: 1]
        V2[difficulty: 1]
        V3[word+meaning: text]
    end

    subgraph "QuizResult Collection Indexes"
        Q1[user: 1, createdAt: -1]
        Q2[topic: 1]
    end

    style U1 fill:#4CAF50
    style U2 fill:#4CAF50
    style P1 fill:#2196F3
    style P2 fill:#2196F3
    style P3 fill:#2196F3
    style P4 fill:#2196F3
    style S1 fill:#FF9800
    style S2 fill:#FF9800
    style S3 fill:#FF9800
```

---

## 4. API REQUEST FLOW

### 4.1. Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Routes
    participant AC as Auth Controller
    participant AS as Auth Service
    participant UM as User Model
    participant DB as MongoDB
    participant JWT as JWT Library

    %% Registration Flow
    Note over C,DB: REGISTRATION FLOW

    C->>R: POST /api/v1/auth/register
    activate R
    R->>AC: register(req, res)
    activate AC
    
    AC->>AS: register(userData)
    activate AS
    
    AS->>UM: Check email exists
    UM->>DB: findOne({ email })
    DB-->>UM: null (not exists)
    UM-->>AS: Email available
    
    AS->>UM: Create user
    Note over UM: Pre-save hook:<br/>Hash password
    UM->>DB: save()
    DB-->>UM: User created
    UM-->>AS: User object
    
    AS->>JWT: sign({ userId })
    JWT-->>AS: JWT Token
    
    AS-->>AC: { token, user }
    deactivate AS
    
    AC-->>R: 201 Created
    deactivate AC
    
    R-->>C: { token, user }
    deactivate R

    %% Login Flow
    Note over C,DB: LOGIN FLOW

    C->>R: POST /api/v1/auth/login
    activate R
    R->>AC: login(req, res)
    activate AC
    
    AC->>AS: login(credentials)
    activate AS
    
    AS->>UM: Find user by email
    UM->>DB: findOne({ email }).select('+password')
    DB-->>UM: User with password
    UM-->>AS: User object
    
    AS->>AS: comparePassword()
    Note over AS: bcrypt.compare()
    
    alt Password Valid
        AS->>JWT: sign({ userId })
        JWT-->>AS: JWT Token
        AS-->>AC: { token, user }
        AC-->>R: 200 OK
        R-->>C: { token, user }
    else Password Invalid
        AS-->>AC: Error: Invalid credentials
        AC-->>R: 401 Unauthorized
        R-->>C: Error message
    end
    
    deactivate AS
    deactivate AC
    deactivate R
```

### 4.2. Protected API Request Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Routes
    participant M as Auth Middleware
    participant QC as Quiz Controller
    participant QS as Quiz Service
    participant VM as Vocabulary Model
    participant QRM as QuizResult Model
    participant PS as Point Service
    participant SS as Streak Service
    participant DB as MongoDB

    C->>R: POST /api/v1/quizzes/submit
    Note over C: Headers:<br/>Authorization: Bearer <token>

    activate R
    R->>M: protect(req, res, next)
    activate M
    
    M->>M: Extract token from header
    M->>M: jwt.verify(token, SECRET)
    
    alt Token Valid
        M->>DB: Find user by ID
        DB-->>M: User object
        M->>M: Attach user to req.user
        M->>QC: next() → submitQuiz()
        
        activate QC
        QC->>QC: Validate request body
        QC->>QS: submitQuiz(userId, topicId, answers)
        
        activate QS
        
        %% Get correct answers
        QS->>VM: Find vocabularies
        VM->>DB: find({ _id: { $in: vocabIds } })
        DB-->>VM: Vocabularies
        VM-->>QS: Correct answers
        
        %% Calculate score
        QS->>QS: Compare answers
        QS->>QS: Calculate score
        
        %% Save quiz result
        QS->>QRM: Create quiz result
        QRM->>DB: save()
        DB-->>QRM: Saved
        QRM-->>QS: QuizResult object
        
        %% Add points
        QS->>PS: addPoints(userId, score)
        activate PS
        PS->>DB: Update Points (increment)
        DB-->>PS: Updated
        deactivate PS
        
        %% Update streak
        QS->>SS: updateStreak(userId)
        activate SS
        SS->>DB: Find/Update Streak
        DB-->>SS: Streak object
        deactivate SS
        
        QS-->>QC: Result object
        deactivate QS
        
        QC-->>R: 200 OK
        deactivate QC
        
        R-->>C: { score, correctAnswers, streak, ... }
        
    else Token Invalid
        M-->>R: 401 Unauthorized
        R-->>C: Error: Invalid token
    end
    
    deactivate M
    deactivate R
```

### 4.3. Quiz Taking Complete Flow

```mermaid
graph TB
    Start([User Opens Quiz Page])
    
    Start --> GetTopics[GET /api/v1/topics<br/>Fetch all topics]
    
    GetTopics --> SelectTopic{User Selects<br/>Topic}
    
    SelectTopic --> GetVocabs[GET /api/v1/topics/:id/vocabularies<br/>?random=true&count=10<br/>Get 10 random words]
    
    GetVocabs --> DisplayQuiz[Display Quiz UI<br/>Show questions with<br/>multiple choices]
    
    DisplayQuiz --> UserAnswers{User Answers<br/>All Questions}
    
    UserAnswers --> Submit[POST /api/v1/quizzes/submit<br/>Send answers to server]
    
    Submit --> ServerGrade[Server validates answers<br/>against database<br/>NOT trusting client]
    
    ServerGrade --> CalcScore[Calculate Score<br/>Each correct = 10 points]
    
    CalcScore --> SaveResult[Save QuizResult<br/>to database]
    
    SaveResult --> AddPoints[Update Points<br/>totalPoints += score<br/>weeklyPoints += score]
    
    AddPoints --> UpdateStreak[Update Streak<br/>Check if studied yesterday<br/>Increment or reset]
    
    UpdateStreak --> ReturnResult[Return Results<br/>score, correctAnswers<br/>incorrectAnswers, streak]
    
    ReturnResult --> DisplayResult[Display Results<br/>Show score, mistakes<br/>Updated streak]
    
    DisplayResult --> Options{User Choice}
    
    Options -->|Try Again| GetVocabs
    Options -->|View History| GetHistory[GET /api/v1/quizzes/history<br/>Show past results]
    Options -->|Leaderboard| GetLeaderboard[GET /api/v1/leaderboard/total<br/>Show rankings]
    Options -->|Exit| End([End])
    
    GetHistory --> End
    GetLeaderboard --> End

    style Start fill:#4CAF50
    style ServerGrade fill:#FF9800
    style CalcScore fill:#FF9800
    style UpdateStreak fill:#2196F3
    style DisplayResult fill:#4CAF50
    style End fill:#F44336
```

---

## 5. MODULE CHÍNH & CHỨC NĂNG

### 5.1. Authentication Module

```mermaid
graph LR
    subgraph "Auth Module"
        direction TB
        AR[Auth Routes<br/>/api/v1/auth]
        AC[Auth Controller]
        AS[Auth Service]
        
        AR --> AC
        AC --> AS
        
        subgraph "Features"
            F1[Register]
            F2[Login]
            F3[Logout]
            F4[Get Profile]
            F5[Update Profile]
            F6[Change Password]
        end
        
        AS --> F1 & F2 & F3 & F4 & F5 & F6
    end
    
    subgraph "Security"
        JWT[JWT Token<br/>Generation]
        BCRYPT[Password<br/>Hashing]
        VALIDATE[Input<br/>Validation]
    end
    
    AS --> JWT & BCRYPT & VALIDATE

    style AR fill:#E3F2FD
    style AC fill:#BBDEFB
    style AS fill:#90CAF9
    style JWT fill:#4CAF50
    style BCRYPT fill:#4CAF50
    style VALIDATE fill:#4CAF50
```

**Chức năng chi tiết:**

1. **Register (Đăng ký)**
   - Validate email format, password strength
   - Check email/username uniqueness
   - Hash password với bcrypt (10 rounds)
   - Create user trong database
   - Generate JWT token (expires 7 days)
   - Return token + user info

2. **Login (Đăng nhập)**
   - Find user by email
   - Verify password với bcrypt.compare()
   - Generate new JWT token
   - Return token + user info

3. **Get Profile (Lấy thông tin)**
   - Verify JWT token (middleware)
   - Fetch user from database
   - Return user info (exclude password)

4. **Change Password (Đổi mật khẩu)**
   - Verify current password
   - Validate new password
   - Hash new password
   - Update database

---

### 5.2. Quiz System Module

```mermaid
graph TB
    subgraph "Quiz Module"
        QR[Quiz Routes<br/>/api/v1/quizzes]
        QC[Quiz Controller]
        QS[Quiz Service]
        
        QR --> QC
        QC --> QS
        
        subgraph "Quiz Features"
            Q1[Submit Quiz]
            Q2[Get History]
            Q3[Get Quiz by ID]
            Q4[Generate Random Quiz]
        end
        
        QS --> Q1 & Q2 & Q3 & Q4
    end
    
    subgraph "Related Services"
        PS[Point Service<br/>Add Points]
        SS[Streak Service<br/>Update Streak]
        StS[Stats Service<br/>Update Stats]
    end
    
    subgraph "Data Models"
        VM[Vocabulary Model]
        QRM[QuizResult Model]
        PM[Point Model]
        SM[Streak Model]
    end
    
    QS --> PS & SS & StS
    QS --> VM & QRM
    PS --> PM
    SS --> SM

    style QR fill:#E3F2FD
    style QC fill:#BBDEFB
    style QS fill:#90CAF9
    style PS fill:#FFF9C4
    style SS fill:#FFF9C4
    style StS fill:#FFF9C4
```

**Chức năng chi tiết:**

1. **Submit Quiz**
   ```
   Input: userId, topicId, answers[]
   
   Process:
   ① Fetch correct answers from Vocabulary collection
   ② Compare user answers with correct answers
   ③ Calculate score (10 points per correct answer)
   ④ Save QuizResult to database
   ⑤ Call PointService.addPoints()
   ⑥ Call StreakService.updateStreak()
   ⑦ Return detailed results
   
   Output: {
     totalQuestions, correctAnswers, score,
     incorrectAnswers[], pointsEarned,
     streak: { current, longest }
   }
   ```

2. **Get Quiz History**
   ```
   Input: userId, page, limit
   
   Process:
   ① Query QuizResult collection by userId
   ② Populate topic info
   ③ Sort by createdAt DESC
   ④ Apply pagination
   
   Output: {
     results[],
     pagination: { page, limit, total, totalPages }
   }
   ```

---

### 5.3. Points & Gamification Module

```mermaid
graph TB
    subgraph "Gamification Module"
        direction TB
        
        subgraph "Point System"
            P1[Total Points<br/>All-time score]
            P2[Weekly Points<br/>Reset every week]
            P3[Monthly Points<br/>Reset every month]
        end
        
        subgraph "Streak System"
            S1[Current Streak<br/>Consecutive days]
            S2[Longest Streak<br/>Record]
            S3[Total Days Studied<br/>Lifetime]
        end
        
        subgraph "Leaderboard"
            L1[Total Points Ranking]
            L2[Weekly Ranking]
            L3[Monthly Ranking]
            L4[Streak Ranking]
        end
        
        subgraph "Rewards"
            R1[Shop Items<br/>Unlock with points]
            R2[Achievements<br/>Badges]
            R3[Daily Challenges<br/>Bonus points]
        end
    end
    
    P1 & P2 & P3 --> L1 & L2 & L3
    S1 & S2 --> L4
    P1 --> R1 & R2 & R3

    style P1 fill:#4CAF50
    style P2 fill:#8BC34A
    style P3 fill:#CDDC39
    style S1 fill:#FF9800
    style S2 fill:#FF5722
    style L1 fill:#2196F3
    style L2 fill:#03A9F4
```

**Point System Logic:**

```javascript
// When user completes quiz:
const score = correctAnswers * 10

await Point.findOneAndUpdate(
  { user: userId },
  { 
    $inc: { 
      totalPoints: score,      // Tích lũy mãi mãi
      weeklyPoints: score,     // Reset mỗi thứ 2
      monthlyPoints: score     // Reset đầu tháng
    }
  },
  { upsert: true }
)
```

**Streak Calculation Logic:**

```javascript
const today = new Date().setHours(0,0,0,0)
const lastStudy = streak.lastStudyDate.setHours(0,0,0,0)

if (isToday(lastStudy)) {
  // Already studied today, no change
  return streak
}

if (isYesterday(lastStudy)) {
  // Studied yesterday → increment
  streak.currentStreak++
} else {
  // Break in streak → reset
  streak.currentStreak = 1
}

if (streak.currentStreak > streak.longestStreak) {
  streak.longestStreak = streak.currentStreak
}

streak.totalDaysStudied++
streak.lastStudyDate = today
```

---

### 5.4. Statistics & Analytics Module

```mermaid
graph LR
    subgraph "Stats Module"
        direction TB
        
        StS[Stats Service]
        
        subgraph "User Stats"
            US1[Overall Stats<br/>Total performance]
            US2[Weekly Stats<br/>Last 7 days]
            US3[Monthly Stats<br/>Last 30 days]
            US4[Topic Stats<br/>Per topic performance]
        end
        
        subgraph "Metrics"
            M1[Total Quizzes]
            M2[Accuracy Rate]
            M3[Avg Completion Time]
            M4[Points Earned]
            M5[Streak Info]
            M6[Progress %]
        end
        
        StS --> US1 & US2 & US3 & US4
        US1 & US2 & US3 & US4 --> M1 & M2 & M3 & M4 & M5 & M6
    end
    
    subgraph "Data Sources"
        QR[QuizResult<br/>Collection]
        P[Point<br/>Collection]
        S[Streak<br/>Collection]
        UP[UserProgress<br/>Collection]
    end
    
    StS --> QR & P & S & UP

    style StS fill:#90CAF9
    style US1 fill:#FFF9C4
    style M1 fill:#C8E6C9
    style M2 fill:#C8E6C9
```

**Stats Calculation Example:**

```javascript
// Overall Stats
const stats = await QuizResult.aggregate([
  { $match: { user: userId } },
  {
    $group: {
      _id: null,
      totalQuizzes: { $sum: 1 },
      totalQuestions: { $sum: '$totalQuestions' },
      totalCorrect: { $sum: '$correctAnswers' },
      avgTime: { $avg: '$completionTime' }
    }
  }
])

const accuracy = (totalCorrect / totalQuestions) * 100
```

---

### 5.5. Topic & Vocabulary Module

```mermaid
graph TB
    subgraph "Content Module"
        TR[Topic Routes]
        TC[Topic Controller]
        TS[Topic Service]
        
        TR --> TC
        TC --> TS
        
        subgraph "Topic Features"
            T1[List All Topics<br/>Pagination]
            T2[Get Topic by ID]
            T3[Create Topic<br/>Admin]
            T4[Update Topic<br/>Admin]
            T5[Delete Topic<br/>Admin]
        end
        
        subgraph "Vocabulary Features"
            V1[Get Vocabs by Topic<br/>Pagination]
            V2[Random Vocabs<br/>For Quiz]
            V3[Search Vocabs<br/>Full-text search]
            V4[Filter by Difficulty]
            V5[CRUD Operations<br/>Admin]
        end
        
        TS --> T1 & T2 & T3 & T4 & T5
        TS --> V1 & V2 & V3 & V4 & V5
    end
    
    subgraph "Vocabulary Data"
        VD[Word<br/>Pronunciation<br/>Meaning<br/>Example<br/>Image/Audio URLs<br/>Choices<br/>Difficulty]
    end
    
    V1 & V2 --> VD

    style TR fill:#E3F2FD
    style TC fill:#BBDEFB
    style TS fill:#90CAF9
    style VD fill:#FFF9C4
```

**Random Vocabulary Selection (For Quiz):**

```javascript
// Random 10 words from a topic
const vocabularies = await Vocabulary.aggregate([
  { $match: { topic: topicId } },
  { $sample: { size: 10 } }  // MongoDB random sampling
])

// Generate choices for multiple choice
for (let vocab of vocabularies) {
  // Get 3 random wrong answers
  const wrongChoices = await Vocabulary.aggregate([
    { 
      $match: { 
        topic: topicId,
        _id: { $ne: vocab._id }
      }
    },
    { $sample: { size: 3 } },
    { $project: { meaning: 1 } }
  ])
  
  vocab.choices = wrongChoices.map(c => c.meaning)
}
```

---

## 6. SECURITY ARCHITECTURE

### 6.1. Authentication & Authorization Flow

```mermaid
graph TB
    subgraph "Security Layers"
        direction TB
        
        L1[Layer 1: HTTPS/SSL<br/>Encrypted Transport]
        L2[Layer 2: CORS<br/>Origin Validation]
        L3[Layer 3: Rate Limiting<br/>DDoS Protection]
        L4[Layer 4: JWT Auth<br/>Token Validation]
        L5[Layer 5: Input Validation<br/>SQL/NoSQL Injection]
        L6[Layer 6: Authorization<br/>Role-based Access]
        
        L1 --> L2
        L2 --> L3
        L3 --> L4
        L4 --> L5
        L5 --> L6
    end
    
    subgraph "Password Security"
        PS1[Bcrypt Hashing<br/>10 rounds]
        PS2[Salt per user<br/>Random salt]
        PS3[One-way Hash<br/>Cannot reverse]
    end
    
    subgraph "JWT Security"
        JS1[Secret Key<br/>256-bit minimum]
        JS2[Expiration<br/>7 days default]
        JS3[Signature<br/>HS256 algorithm]
    end
    
    L4 --> JS1 & JS2 & JS3
    L5 --> PS1 & PS2 & PS3

    style L1 fill:#F44336
    style L2 fill:#FF5722
    style L3 fill:#FF9800
    style L4 fill:#FFC107
    style L5 fill:#FFEB3B
    style L6 fill:#CDDC39
```

### 6.2. JWT Token Structure

```mermaid
graph LR
    subgraph "JWT Token"
        H[Header<br/>Algorithm: HS256<br/>Type: JWT]
        P[Payload<br/>userId<br/>iat<br/>exp]
        S[Signature<br/>HMACSHA256]
    end
    
    H --> P
    P --> S
    
    subgraph "Verification Process"
        V1[1. Extract token<br/>from header]
        V2[2. Verify signature<br/>with secret key]
        V3[3. Check expiration<br/>iat & exp]
        V4[4. Extract userId<br/>from payload]
        V5[5. Fetch user<br/>from database]
        V6[6. Attach to req.user]
    end
    
    S --> V1
    V1 --> V2
    V2 --> V3
    V3 --> V4
    V4 --> V5
    V5 --> V6

    style H fill:#E3F2FD
    style P fill:#BBDEFB
    style S fill:#90CAF9
```

### 6.3. Data Validation & Sanitization

```mermaid
graph TB
    Input[User Input]
    
    Input --> V1{Schema Validation<br/>Mongoose}
    
    V1 -->|Invalid| E1[Return 400<br/>Validation Error]
    V1 -->|Valid| V2{Business Rules<br/>Service Layer}
    
    V2 -->|Invalid| E2[Return 400<br/>Business Error]
    V2 -->|Valid| V3{Authorization<br/>User Permissions}
    
    V3 -->|Unauthorized| E3[Return 403<br/>Forbidden]
    V3 -->|Authorized| Process[Process Request]
    
    Process --> Sanitize[Sanitize Output<br/>Remove sensitive data]
    Sanitize --> Response[Return Response]

    style Input fill:#FFC107
    style V1 fill:#4CAF50
    style V2 fill:#4CAF50
    style V3 fill:#4CAF50
    style Process fill:#2196F3
    style E1 fill:#F44336
    style E2 fill:#F44336
    style E3 fill:#F44336
```

---

## 7. DATA FLOW DIAGRAMS

### 7.1. User Registration Data Flow

```mermaid
graph TB
    Start([User fills<br/>registration form])
    
    Start --> ClientValidate{Client-side<br/>validation}
    
    ClientValidate -->|Invalid| ShowError1[Show error<br/>on form]
    ClientValidate -->|Valid| SendRequest[POST /api/v1/auth/register<br/>username, email, password]
    
    SendRequest --> ServerReceive[Server receives request]
    
    ServerReceive --> ServerValidate{Server validates<br/>input}
    
    ServerValidate -->|Invalid| Return400[400 Bad Request<br/>Validation errors]
    ServerValidate -->|Valid| CheckEmail{Email exists?}
    
    CheckEmail -->|Yes| Return409[409 Conflict<br/>Email already exists]
    CheckEmail -->|No| CheckUsername{Username exists?}
    
    CheckUsername -->|Yes| Return409b[409 Conflict<br/>Username taken]
    CheckUsername -->|No| HashPassword[Hash password<br/>bcrypt.hash]
    
    HashPassword --> CreateUser[Create User<br/>in MongoDB]
    
    CreateUser --> InitGamification[Initialize<br/>Point & Streak<br/>records]
    
    InitGamification --> GenerateToken[Generate JWT<br/>token]
    
    GenerateToken --> Return201[201 Created<br/>token + user info]
    
    Return201 --> ClientSave[Client saves token<br/>in localStorage]
    
    ClientSave --> Redirect[Redirect to<br/>dashboard]
    
    Redirect --> End([Registration<br/>Complete])
    
    Return400 & Return409 & Return409b --> ShowError2[Display error<br/>to user]

    style Start fill:#4CAF50
    style HashPassword fill:#FF9800
    style GenerateToken fill:#2196F3
    style End fill:#4CAF50
    style Return400 fill:#F44336
    style Return409 fill:#F44336
    style Return409b fill:#F44336
```

### 7.2. Quiz Submission Data Flow

```mermaid
graph TB
    Start([User submits<br/>quiz answers])
    
    Start --> PrepareData[Prepare request<br/>topicId + answers[]]
    
    PrepareData --> AddToken[Add JWT token<br/>to headers]
    
    AddToken --> SendRequest[POST /api/v1/quizzes/submit]
    
    SendRequest --> AuthMiddleware{Verify JWT<br/>token}
    
    AuthMiddleware -->|Invalid| Return401[401 Unauthorized]
    AuthMiddleware -->|Valid| AttachUser[Attach user<br/>to req.user]
    
    AttachUser --> ValidateInput{Validate<br/>request body}
    
    ValidateInput -->|Invalid| Return400[400 Bad Request]
    ValidateInput -->|Valid| FetchVocabs[Fetch vocabularies<br/>from database]
    
    FetchVocabs --> CreateMap[Create vocabId → vocab<br/>Map for O1 lookup]
    
    CreateMap --> CompareAnswers[Compare each answer<br/>with correct answer]
    
    CompareAnswers --> CalcScore[Calculate score<br/>correctCount × 10]
    
    CalcScore --> SaveResult[Save QuizResult<br/>to database]
    
    SaveResult --> CallPointService[Call Point Service<br/>addPoints]
    
    CallPointService --> UpdatePoints[Update Points<br/>increment totalPoints<br/>weeklyPoints<br/>monthlyPoints]
    
    UpdatePoints --> CallStreakService[Call Streak Service<br/>updateStreak]
    
    CallStreakService --> CheckLastStudy{Studied<br/>yesterday?}
    
    CheckLastStudy -->|Yes| IncrementStreak[currentStreak++]
    CheckLastStudy -->|No| ResetStreak[currentStreak = 1]
    
    IncrementStreak --> UpdateLongest{currentStreak ><br/>longestStreak?}
    ResetStreak --> UpdateLongest
    
    UpdateLongest -->|Yes| SetLongest[longestStreak =<br/>currentStreak]
    UpdateLongest -->|No| SaveStreak[Save streak<br/>to database]
    SetLongest --> SaveStreak
    
    SaveStreak --> PrepareResponse[Prepare response<br/>with results]
    
    PrepareResponse --> Return200[200 OK<br/>score, correctAnswers<br/>incorrectAnswers<br/>streak info]
    
    Return200 --> ClientReceive[Client receives<br/>results]
    
    ClientReceive --> DisplayResults[Display results<br/>Score animation<br/>Streak update<br/>Show mistakes]
    
    DisplayResults --> UpdateUI[Update UI<br/>Points badge<br/>Streak flame<br/>Leaderboard rank]
    
    UpdateUI --> End([Quiz Complete])
    
    Return401 & Return400 --> ShowError[Display error<br/>to user]

    style Start fill:#4CAF50
    style CompareAnswers fill:#FF9800
    style CalcScore fill:#FF9800
    style IncrementStreak fill:#2196F3
    style DisplayResults fill:#4CAF50
    style End fill:#4CAF50
    style Return401 fill:#F44336
    style Return400 fill:#F44336
```

### 7.3. Leaderboard Query Data Flow

```mermaid
graph LR
    Client[Client Request<br/>GET /leaderboard/total]
    
    Client --> Server[Server receives]
    
    Server --> Query[Query Point collection<br/>sort by totalPoints DESC]
    
    Query --> Index[Use totalPoints index<br/>Fast sorting]
    
    Index --> Paginate[Apply pagination<br/>skip + limit]
    
    Paginate --> Populate[Populate user info<br/>username, email]
    
    Populate --> AddRank[Add rank field<br/>based on position]
    
    AddRank --> Response[Return response<br/>leaderboard + pagination]
    
    Response --> Cache[Cache in Redis<br/>5 minutes TTL]
    
    Cache --> Client

    style Client fill:#4CAF50
    style Index fill:#FF9800
    style Cache fill:#2196F3
```

---

## 8. DEPLOYMENT ARCHITECTURE

### 8.1. Production Deployment

```mermaid
graph TB
    subgraph "Client Devices"
        WEB[Web Browser]
        MOBILE[Mobile App]
    end

    subgraph "CDN Layer"
        CDN[CloudFlare CDN<br/>Static Assets<br/>Images/Audio]
    end

    subgraph "Cloud Infrastructure - AWS/Azure"
        subgraph "Load Balancer"
            LB[Application<br/>Load Balancer<br/>Auto-scaling]
        end
        
        subgraph "Application Servers"
            APP1[Node.js Server 1<br/>Docker Container]
            APP2[Node.js Server 2<br/>Docker Container]
            APP3[Node.js Server 3<br/>Docker Container]
        end
        
        subgraph "Database Cluster"
            MONGO_PRIMARY[(MongoDB Primary<br/>Read/Write)]
            MONGO_SECONDARY1[(MongoDB Secondary<br/>Read Only)]
            MONGO_SECONDARY2[(MongoDB Secondary<br/>Read Only)]
        end
        
        subgraph "Cache Layer"
            REDIS_MASTER[(Redis Master)]
            REDIS_SLAVE[(Redis Slave)]
        end
        
        subgraph "Storage"
            S3[AWS S3<br/>Media Files<br/>Backups]
        end
    end
    
    subgraph "Monitoring"
        PM2[PM2<br/>Process Manager]
        PROM[Prometheus<br/>Metrics]
        GRAF[Grafana<br/>Dashboards]
        SENTRY[Sentry<br/>Error Tracking]
    end

    WEB & MOBILE --> CDN
    CDN --> LB
    LB --> APP1 & APP2 & APP3
    
    APP1 & APP2 & APP3 --> MONGO_PRIMARY
    APP1 & APP2 & APP3 --> MONGO_SECONDARY1 & MONGO_SECONDARY2
    APP1 & APP2 & APP3 --> REDIS_MASTER
    REDIS_MASTER --> REDIS_SLAVE
    APP1 & APP2 & APP3 --> S3
    
    MONGO_PRIMARY -.->|Replication| MONGO_SECONDARY1 & MONGO_SECONDARY2
    
    APP1 & APP2 & APP3 --> PM2
    PM2 --> PROM
    PROM --> GRAF
    APP1 & APP2 & APP3 --> SENTRY

    style LB fill:#FF9800
    style APP1 fill:#4CAF50
    style APP2 fill:#4CAF50
    style APP3 fill:#4CAF50
    style MONGO_PRIMARY fill:#47A248
    style REDIS_MASTER fill:#DC382D
```

### 8.2. Docker Container Architecture

```mermaid
graph TB
    subgraph "Docker Compose Setup"
        subgraph "App Container"
            NODE[Node.js App<br/>Port 5000]
        end
        
        subgraph "Database Container"
            MONGO[MongoDB<br/>Port 27017]
        end
        
        subgraph "Cache Container"
            REDIS[Redis<br/>Port 6379]
        end
        
        subgraph "Nginx Container"
            NGINX[Nginx Reverse Proxy<br/>Port 80/443]
        end
    end
    
    NGINX --> NODE
    NODE --> MONGO
    NODE --> REDIS
    
    subgraph "Volumes"
        V1[mongo-data<br/>Persistent storage]
        V2[redis-data<br/>Persistent storage]
        V3[app-logs<br/>Log files]
    end
    
    MONGO --> V1
    REDIS --> V2
    NODE --> V3

    style NODE fill:#4CAF50
    style MONGO fill:#47A248
    style REDIS fill:#DC382D
    style NGINX fill:#269539
```

---

## 9. PERFORMANCE OPTIMIZATION

### 9.1. Database Query Optimization

```mermaid
graph LR
    subgraph "Optimization Techniques"
        I1[Indexes<br/>B-tree indexes on<br/>frequently queried fields]
        
        I2[Aggregation Pipeline<br/>Server-side processing<br/>Reduce data transfer]
        
        I3[Lean Queries<br/>Plain JS objects<br/>Skip Mongoose overhead]
        
        I4[Select Fields<br/>Only fetch needed data<br/>Reduce bandwidth]
        
        I5[Pagination<br/>Limit result size<br/>Prevent memory issues]
    end
    
    subgraph "Caching Strategy"
        C1[Redis Cache<br/>Leaderboard: 5 min<br/>Topics: 1 hour]
        
        C2[In-Memory Cache<br/>Hot data in RAM<br/>Node.js cache]
    end
    
    subgraph "Results"
        R1[Fast Response<br/>< 100ms avg]
        R2[Low DB Load<br/>Reduced queries]
        R3[Scalability<br/>Handle high traffic]
    end
    
    I1 & I2 & I3 & I4 & I5 --> R1 & R2 & R3
    C1 & C2 --> R1 & R2 & R3

    style I1 fill:#4CAF50
    style I2 fill:#4CAF50
    style I3 fill:#4CAF50
    style C1 fill:#2196F3
    style C2 fill:#2196F3
    style R1 fill:#FF9800
```

### 9.2. API Response Time Breakdown

```mermaid
gantt
    title API Response Time Analysis (Total: ~150ms)
    dateFormat X
    axisFormat %L ms

    section Network
    Client to Server       :0, 10
    
    section Middleware
    CORS & Auth           :10, 15
    
    section Controller
    Parse & Validate      :15, 10
    
    section Service
    Business Logic        :25, 20
    
    section Database
    Query Execution       :45, 60
    
    section Processing
    Data Formatting       :105, 20
    
    section Network
    Server to Client      :125, 25
```

---

## 10. SCALING STRATEGY

### 10.1. Horizontal Scaling

```mermaid
graph TB
    subgraph "Traffic Growth"
        T1[1K Users<br/>Single Server]
        T2[10K Users<br/>2-3 Servers]
        T3[100K Users<br/>5-10 Servers]
        T4[1M+ Users<br/>Auto-scaling group]
    end
    
    T1 --> T2
    T2 --> T3
    T3 --> T4
    
    subgraph "Strategies"
        S1[Load Balancer<br/>Distribute requests]
        S2[Stateless Apps<br/>No session on server]
        S3[Database Replication<br/>Read replicas]
        S4[Caching Layer<br/>Redis cluster]
        S5[CDN<br/>Static content]
    end
    
    T4 --> S1 & S2 & S3 & S4 & S5

    style T1 fill:#C8E6C9
    style T2 fill:#81C784
    style T3 fill:#66BB6A
    style T4 fill:#4CAF50
```

---

## 📊 TÓM TẮT KIẾN TRÚC

### ✅ Điểm Mạnh Của Kiến Trúc

1. **Layered Architecture** - Tách biệt rõ ràng giữa các layer
2. **RESTful API** - Chuẩn REST, dễ tích hợp
3. **Stateless** - Không lưu session, dễ scale horizontal
4. **JWT Authentication** - Bảo mật, không cần session store
5. **MongoDB Indexes** - Query nhanh với indexes
6. **Error Handling** - Centralized error handling
7. **Validation** - Multi-layer validation (client, server, database)
8. **Modular** - Dễ maintain và extend

### 🎯 Core Features Implemented

- ✅ Authentication & Authorization (JWT)
- ✅ User Management
- ✅ Topics & Vocabularies Management
- ✅ Quiz System với Auto-grading
- ✅ Points & Gamification
- ✅ Streak Tracking
- ✅ Leaderboard System
- ✅ Statistics & Analytics
- ✅ Quiz History

### 🚀 Future Enhancements

- [ ] Redis Caching Layer
- [ ] WebSocket for Real-time features
- [ ] Multiplayer Quiz Mode
- [ ] AI-powered recommendations
- [ ] Advanced Analytics Dashboard
- [ ] Mobile Push Notifications
- [ ] Social Features (Friends, Chat)
- [ ] Achievement/Badge System

---

## 📞 DOCUMENT INFO

**Created by:** Development Team  
**Version:** 1.0.0  
**Last Updated:** March 2, 2026  
**Status:** Production Ready

---

**END OF DOCUMENT**
