import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho QuizResult document
export interface IQuizResult extends Document {
  user: mongoose.Types.ObjectId
  quiz: mongoose.Types.ObjectId
  score: number
  createdAt: Date
  updatedAt: Date
}

// Schema
const quizResultSchema: Schema<IQuizResult> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    score: { type: Number }
  },
  { timestamps: true }
)

// Model
const QuizResult: Model<IQuizResult> = mongoose.model<IQuizResult>(
  'QuizResult',
  quizResultSchema
)

export default QuizResult
