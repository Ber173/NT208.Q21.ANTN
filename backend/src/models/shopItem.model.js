const mongoose = require('mongoose')

const shopItemSchema = new mongoose.Schema(
  {
    name: String,
    price: Number
  },
  { timestamps: true }
)

module.exports = mongoose.model('ShopItem', shopItemSchema)
