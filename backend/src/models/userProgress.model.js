const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserProgress', userProgressSchema)
