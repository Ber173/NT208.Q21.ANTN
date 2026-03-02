import mongoose, { Schema, Document, Model } from 'mongoose'

// ==============================
// Interface cho Streak document
// ==============================
export interface IStreak extends Document {
  user: mongoose.Types.ObjectId
  currentStreak: number
  longestStreak: number
  lastStudyDate: Date
  totalDaysStudied: number // Tổng số ngày đã học (để thống kê)
  createdAt: Date
  updatedAt: Date
}

// ==============================
// Schema
// ==============================
const streakSchema: Schema<IStreak> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // Mỗi user chỉ có 1 record streak (unique tự động tạo index)
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0
    },
    lastStudyDate: {
      type: Date,
      default: null
    },
    totalDaysStudied: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
)

// ==============================
// Indexes for Leaderboard
// ==============================
// Index để sắp xếp leaderboard theo longest streak
streakSchema.index({ longestStreak: -1 })
// Index để sắp xếp theo current streak
streakSchema.index({ currentStreak: -1 })

// ==============================
// Model
// ==============================
const Streak: Model<IStreak> = mongoose.model<IStreak>('Streak', streakSchema)

export default Streak
