const mongoose = require('mongoose')

const streakLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date
  },
  { timestamps: true }
)

module.exports = mongoose.model('StreakLog', streakLogSchema)
