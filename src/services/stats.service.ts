// =======================================================
// STATISTICS SERVICE
// =======================================================

import QuizResult from '~/models/quizResult.model'
import Point from '~/models/point.model'
import Streak from '~/models/streak.model'
import mongoose from 'mongoose'

/**
 * THỐNG KÊ TỔNG QUAN CỦA USER
 * Hiển thị các chỉ số tổng quan
 */
export const getUserOverallStats = async (
  userId: string | mongoose.Types.ObjectId
) => {
  const [points, streak, quizStats] = await Promise.all([
    // Điểm
    Point.findOne({ user: userId }).select(
      'totalPoints weeklyPoints monthlyPoints'
    ),

    // Streak
    Streak.findOne({ user: userId }).select(
      'currentStreak longestStreak totalDaysStudied'
    ),

    // Tổng số quiz đã làm và tỷ lệ đúng
    QuizResult.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId as string) } },
      {
        $group: {
          _id: null,
          totalQuizzes: { $sum: 1 },
          totalQuestions: { $sum: '$totalQuestions' },
          totalCorrect: { $sum: '$correctAnswers' },
          totalScore: { $sum: '$score' },
          avgCompletionTime: { $avg: '$completionTime' }
        }
      }
    ])
  ])

  const quizData = quizStats[0] || {
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    totalScore: 0,
    avgCompletionTime: 0
  }

  const accuracy =
    quizData.totalQuestions > 0
      ? (quizData.totalCorrect / quizData.totalQuestions) * 100
      : 0

  return {
    points: {
      total: points?.totalPoints || 0,
      weekly: points?.weeklyPoints || 0,
      monthly: points?.monthlyPoints || 0
    },
    streak: {
      current: streak?.currentStreak || 0,
      longest: streak?.longestStreak || 0,
      totalDays: streak?.totalDaysStudied || 0
    },
    quiz: {
      totalCompleted: quizData.totalQuizzes,
      totalQuestions: quizData.totalQuestions,
      totalCorrect: quizData.totalCorrect,
      accuracy: Math.round(accuracy * 100) / 100, // Làm tròn 2 chữ số
      totalScore: quizData.totalScore,
      avgCompletionTime: Math.round(quizData.avgCompletionTime || 0)
    }
  }
}

/**
 * THỐNG KÊ THEO TUẦN
 * Hiển thị hoạt động trong 7 ngày gần nhất
 */
export const getWeeklyStats = async (
  userId: string | mongoose.Types.ObjectId
) => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Thống kê quiz trong tuần
  const weeklyQuizzes = await QuizResult.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId as string),
        createdAt: { $gte: sevenDaysAgo, $lte: today }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        count: { $sum: 1 },
        totalScore: { $sum: '$score' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ])

  // Tạo mảng 7 ngày với giá trị mặc định
  const dailyStats = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayData = weeklyQuizzes.find((d) => d._id === dateStr) || {
      count: 0,
      totalScore: 0,
      totalCorrect: 0,
      totalQuestions: 0
    }

    dailyStats.push({
      date: dateStr,
      quizzesCompleted: dayData.count,
      score: dayData.totalScore,
      accuracy:
        dayData.totalQuestions > 0
          ? Math.round(
            (dayData.totalCorrect / dayData.totalQuestions) * 100 * 100
          ) / 100
          : 0
    })
  }

  return {
    period: 'week',
    from: sevenDaysAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
    dailyStats
  }
}

/**
 * THỐNG KÊ THEO THÁNG
 * Hiển thị hoạt động trong 30 ngày gần nhất
 */
export const getMonthlyStats = async (
  userId: string | mongoose.Types.ObjectId
) => {
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  // Thống kê theo tuần (4 tuần gần nhất)
  const weeklyStats = await QuizResult.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId as string),
        createdAt: { $gte: thirtyDaysAgo, $lte: today }
      }
    },
    {
      $group: {
        _id: {
          week: { $week: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        count: { $sum: 1 },
        totalScore: { $sum: '$score' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.week': 1 }
    }
  ])

  const stats = weeklyStats.map((week) => ({
    week: `Week ${week._id.week}`,
    year: week._id.year,
    quizzesCompleted: week.count,
    score: week.totalScore,
    accuracy:
      week.totalQuestions > 0
        ? Math.round((week.totalCorrect / week.totalQuestions) * 100 * 100) /
          100
        : 0
  }))

  return {
    period: 'month',
    from: thirtyDaysAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
    weeklyStats: stats
  }
}

/**
 * THỐNG KÊ THEO TOPIC
 * Hiển thị tiến độ học theo từng chủ đề
 */
export const getTopicStats = async (
  userId: string | mongoose.Types.ObjectId
) => {
  const topicStats = await QuizResult.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId as string) }
    },
    {
      $group: {
        _id: '$topic',
        quizzesCompleted: { $sum: 1 },
        totalScore: { $sum: '$score' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' },
        bestScore: { $max: '$score' },
        avgScore: { $avg: '$score' }
      }
    },
    {
      $lookup: {
        from: 'topics',
        localField: '_id',
        foreignField: '_id',
        as: 'topic'
      }
    },
    {
      $unwind: '$topic'
    },
    {
      $project: {
        topic: {
          _id: '$topic._id',
          name: '$topic.name'
        },
        quizzesCompleted: 1,
        totalScore: 1,
        accuracy: {
          $cond: [
            { $gt: ['$totalQuestions', 0] },
            {
              $multiply: [
                { $divide: ['$totalCorrect', '$totalQuestions'] },
                100
              ]
            },
            0
          ]
        },
        bestScore: 1,
        avgScore: { $round: ['$avgScore', 2] }
      }
    },
    {
      $sort: { totalScore: -1 }
    }
  ])

  return {
    topics: topicStats
  }
}

/**
 * THỐNG KÊ SO SÁNH GIỮA CÁC LOẠI QUIZ
 * Text vs Multiple Choice
 */
export const getQuizTypeStats = async (
  userId: string | mongoose.Types.ObjectId
) => {
  const stats = await QuizResult.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId as string) }
    },
    {
      $group: {
        _id: '$quizType',
        count: { $sum: 1 },
        totalScore: { $sum: '$score' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalQuestions: { $sum: '$totalQuestions' },
        avgTime: { $avg: '$completionTime' }
      }
    }
  ])

  const result = {
    text: {
      quizzesCompleted: 0,
      totalScore: 0,
      accuracy: 0,
      avgCompletionTime: 0
    },
    multiple_choice: {
      quizzesCompleted: 0,
      totalScore: 0,
      accuracy: 0,
      avgCompletionTime: 0
    }
  }

  stats.forEach((stat) => {
    const type = stat._id as 'text' | 'multiple_choice'
    const accuracy =
      stat.totalQuestions > 0
        ? Math.round((stat.totalCorrect / stat.totalQuestions) * 100 * 100) /
          100
        : 0

    result[type] = {
      quizzesCompleted: stat.count,
      totalScore: stat.totalScore,
      accuracy,
      avgCompletionTime: Math.round(stat.avgTime || 0)
    }
  })

  return result
}

/**
 * RECENT ACTIVITY
 * Hiển thị hoạt động gần đây
 */
export const getRecentActivity = async (
  userId: string | mongoose.Types.ObjectId,
  limit: number = 10
) => {
  const recentQuizzes = await QuizResult.find({
    user: userId
  })
    .populate('topic', 'name')
    .select('topic score correctAnswers totalQuestions createdAt quizType')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()

  return {
    recentQuizzes: recentQuizzes.map((quiz) => ({
      topic: quiz.topic,
      score: quiz.score,
      accuracy:
        quiz.totalQuestions > 0
          ? Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100 * 100) /
            100
          : 0,
      quizType: quiz.quizType,
      date: quiz.createdAt
    }))
  }
}
