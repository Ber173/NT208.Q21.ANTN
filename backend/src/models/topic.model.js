const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('Topic', topicSchema)
