import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho Quiz document
export interface IQuiz extends Document {
  topic: mongoose.Types.ObjectId
  title: string
  createdAt: Date
  updatedAt: Date
}

// Schema
const quizSchema: Schema<IQuiz> = new Schema(
  {
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    },
    title: { type: String }
  },
  { timestamps: true }
)

// Model
const Quiz: Model<IQuiz> = mongoose.model<IQuiz>(
  'Quiz',
  quizSchema
)

export default Quiz
