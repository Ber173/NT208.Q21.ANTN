import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho Vocabulary document
export interface IVocabulary extends Document {
  word: string
  meaning: string
  topic?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

// Schema
const vocabularySchema: Schema<IVocabulary> = new Schema(
  {
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    }
  },
  { timestamps: true }
)

// Model
const Vocabulary: Model<IVocabulary> =
  mongoose.model<IVocabulary>('Vocabulary', vocabularySchema)

export default Vocabulary
