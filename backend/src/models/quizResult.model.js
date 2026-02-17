const mongoose = require('mongoose')

const quizResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: Number
  },
  { timestamps: true }
)

module.exports = mongoose.model('QuizResult', quizResultSchema)
