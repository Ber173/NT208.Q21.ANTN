import mongoose, { Schema, Document, Model } from 'mongoose'

// ==============================
// Interface cho Vocabulary document
// ==============================
export interface IVocabulary extends Document {
  word: string
  meaning: string
  pronunciation?: string // Phát âm (IPA)
  example?: string // Câu ví dụ
  imageUrl?: string // URL ảnh minh họa
  audioUrl?: string // URL file âm thanh
  topic?: mongoose.Types.ObjectId
  // Cho multiple choice quiz
  choices?: string[] // Các lựa chọn sai (để tạo multiple choice)
  difficulty?: 'easy' | 'medium' | 'hard' // Độ khó
  createdAt: Date
  updatedAt: Date
}

// ==============================
// Schema
// ==============================
const vocabularySchema: Schema<IVocabulary> = new Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true
    },
    meaning: {
      type: String,
      required: true,
      trim: true
    },
    pronunciation: {
      type: String,
      trim: true
    },
    example: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    },
    audioUrl: {
      type: String,
      trim: true
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'Topic'
    },
    // Mảng các đáp án sai (để random tạo multiple choice)
    choices: {
      type: [String],
      default: []
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  },
  { timestamps: true }
)

// ==============================
// Indexes
// ==============================
// Index để tìm kiếm từ vựng theo topic
vocabularySchema.index({ topic: 1 })
// Index để filter theo độ khó
vocabularySchema.index({ difficulty: 1 })
// Text index để search từ vựng
vocabularySchema.index({ word: 'text', meaning: 'text' })

// ==============================
// Model
// ==============================
const Vocabulary: Model<IVocabulary> =
  mongoose.model<IVocabulary>('Vocabulary', vocabularySchema)

export default Vocabulary
