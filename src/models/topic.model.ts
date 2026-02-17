import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho Topic document
export interface ITopic extends Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

// Schema
const topicSchema: Schema<ITopic> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String }
  },
  { timestamps: true }
)

// Model
const Topic: Model<ITopic> = mongoose.model<ITopic>(
  'Topic',
  topicSchema
)

export default Topic
