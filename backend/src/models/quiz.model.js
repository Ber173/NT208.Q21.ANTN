const mongoose = require('mongoose')

const quizSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic'
    },
    title: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('Quiz', quizSchema)
