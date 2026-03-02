import mongoose, { Schema, Document, Model } from 'mongoose'

// ==============================
// Interface cho QuizResult document
// ==============================
export interface IQuizResult extends Document {
  user: mongoose.Types.ObjectId
  topic: mongoose.Types.ObjectId
  quizType: 'text' | 'multiple_choice' // Loại quiz
  totalQuestions: number
  correctAnswers: number
  score: number
  completionTime?: number // Thời gian hoàn thành (giây)
  answers: Array<{
    vocabId: mongoose.Types.ObjectId
    selectedAnswer: string
    correctAnswer: string
    isCorrect: boolean
    timeSpent?: number // Thời gian làm câu này (giây)
  }>
  createdAt: Date
  updatedAt: Date
}

// ==============================
// Schema
// ==============================
const quizResultSchema: Schema<IQuizResult> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },
    quizType: {
      type: String,
      enum: ['text', 'multiple_choice'],
      default: 'text'
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 0
    },
    correctAnswers: {
      type: Number,
      required: true,
      min: 0
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    completionTime: {
      type: Number, // Thời gian hoàn thành (giây)
      min: 0
    },
    answers: [
      {
        vocabId: {
          type: Schema.Types.ObjectId,
          ref: 'Vocabulary',
          required: true
        },
        selectedAnswer: {
          type: String,
          required: true
        },
        correctAnswer: {
          type: String,
          required: true
        },
        isCorrect: {
          type: Boolean,
          required: true
        },
        timeSpent: {
          type: Number, // Thời gian làm câu này (giây)
          min: 0
        }
      }
    ]
  },
  { timestamps: true }
)

// ==============================
// Indexes for Stats & Performance
// ==============================
// Index để truy vấn theo user và topic
quizResultSchema.index({ user: 1, topic: 1 })
// Index để lấy lịch sử theo thời gian
quizResultSchema.index({ user: 1, createdAt: -1 })
// Index để thống kê theo tuần/tháng
quizResultSchema.index({ createdAt: -1 })
// Index để filter theo loại quiz
quizResultSchema.index({ quizType: 1 })
// Index để tìm quiz nhanh nhất (leaderboard)
quizResultSchema.index({ completionTime: 1 })

// ==============================
// Model
// ==============================
const QuizResult: Model<IQuizResult> = mongoose.model<IQuizResult>(
  'QuizResult',
  quizResultSchema
)

export default QuizResult
