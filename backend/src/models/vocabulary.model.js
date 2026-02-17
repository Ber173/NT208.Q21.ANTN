const mongoose = require('mongoose')

const vocabularySchema = new mongoose.Schema(
  {
    word: { type: String, required: true },
    meaning: { type: String, required: true },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Vocabulary', vocabularySchema)
