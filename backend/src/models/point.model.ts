import mongoose, { Schema, Document, Model } from 'mongoose'

// ==============================
// Interface cho Point document
// ==============================
export interface IPoint extends Document {
  user: mongoose.Types.ObjectId
  totalPoints: number
  weeklyPoints: number // Điểm trong tuần này (reset mỗi tuần)
  monthlyPoints: number // Điểm trong tháng này (reset mỗi tháng)
  lastWeekReset: Date // Lần reset điểm tuần gần nhất
  lastMonthReset: Date // Lần reset điểm tháng gần nhất
  createdAt: Date
  updatedAt: Date
}

// ==============================
// Schema
// ==============================
const pointSchema: Schema<IPoint> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // Mỗi user chỉ có 1 record điểm (unique tự động tạo index)
    },
    totalPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    weeklyPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    monthlyPoints: {
      type: Number,
      default: 0,
      min: 0
    },
    lastWeekReset: {
      type: Date,
      default: Date.now
    },
    lastMonthReset: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

// ==============================
// Indexes for Leaderboard
// ==============================
// Index để sắp xếp leaderboard theo tổng điểm
pointSchema.index({ totalPoints: -1 })
// Index để sắp xếp leaderboard tuần
pointSchema.index({ weeklyPoints: -1 })
// Index để sắp xếp leaderboard tháng
pointSchema.index({ monthlyPoints: -1 })

// ==============================
// Model
// ==============================
const Point: Model<IPoint> = mongoose.model<IPoint>('Point', pointSchema)

export default Point
