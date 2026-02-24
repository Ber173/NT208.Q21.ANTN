import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface cho ShopItem document
export interface IShopItem extends Document {
  name: string
  price: number
  createdAt: Date
  updatedAt: Date
}

// Schema
const shopItemSchema: Schema<IShopItem> = new Schema(
  {
    name: { type: String },
    price: { type: Number }
  },
  { timestamps: true }
)

// Model
const ShopItem: Model<IShopItem> = mongoose.model<IShopItem>(
  'ShopItem',
  shopItemSchema
)

export default ShopItem
