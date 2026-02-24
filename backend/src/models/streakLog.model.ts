import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho StreakLog document
export interface IStreakLog extends Document {
  user: mongoose.Types.ObjectId
  date: Date
  createdAt: Date
  updatedAt: Date
}

// Schema
const streakLogSchema: Schema<IStreakLog> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date }
  },
  { timestamps: true }
)

// Model
const StreakLog: Model<IStreakLog> = mongoose.model<IStreakLog>(
  'StreakLog',
  streakLogSchema
)

export default StreakLog
