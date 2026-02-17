const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz'
    },
    questionText: String,
    options: [String],
    correctAnswer: String
  },
  { timestamps: true }
)

module.exports = mongoose.model('Question', questionSchema)
