const mongoose = require('mongoose')

const purchaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem' }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Purchase', purchaseSchema)
