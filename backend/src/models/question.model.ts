import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho Question document
export interface IQuestion extends Document {
  quiz: mongoose.Types.ObjectId
  questionText: string
  options: string[]
  correctAnswer: string
  createdAt: Date
  updatedAt: Date
}

// Schema
const questionSchema: Schema<IQuestion> = new Schema(
  {
    quiz: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    questionText: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: String }
  },
  { timestamps: true }
)

// Model
const Question: Model<IQuestion> = mongoose.model<IQuestion>(
  'Question',
  questionSchema
)

export default Question
