import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho UserProgress document
export interface IUserProgress extends Document {
  user: mongoose.Types.ObjectId
  topic: mongoose.Types.ObjectId
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

// Schema
const userProgressSchema: Schema<IUserProgress> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
)

// Model
const UserProgress: Model<IUserProgress> =
  mongoose.model<IUserProgress>('UserProgress', userProgressSchema)

export default UserProgress
