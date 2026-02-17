import mongoose, { Schema, Document, Model } from 'mongoose'

// Định nghĩa interface cho Purchase document
export interface IPurchase extends Document {
  user: mongoose.Types.ObjectId
  item: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

// Định nghĩa schema
const purchaseSchema: Schema<IPurchase> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    item: { type: Schema.Types.ObjectId, ref: 'ShopItem' }
  },
  { timestamps: true }
)

// Tạo model
const Purchase: Model<IPurchase> = mongoose.model<IPurchase>(
  'Purchase',
  purchaseSchema
)

export default Purchase
