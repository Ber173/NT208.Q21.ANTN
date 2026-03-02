// =======================================================
// LEADERBOARD SERVICE
// =======================================================

import Point from '~/models/point.model'
import Streak from '~/models/streak.model'
import QuizResult from '~/models/quizResult.model'
import mongoose from 'mongoose'

// ==============================
// Interface cho pagination
// ==============================
interface LeaderboardOptions {
  page?: number
  limit?: number
}

/**
 * LEADERBOARD TỔNG ĐIỂM (ALL TIME)
 * Hiển thị top users theo tổng điểm tích lũy
 */
export const getTotalPointsLeaderboard = async (
  options: LeaderboardOptions = {}
) => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  const leaderboard = await Point.find()
    .populate('user', 'username email') // Lấy thông tin user
    .select('user totalPoints')
    .sort({ totalPoints: -1 }) // Sắp xếp giảm dần
    .skip(skip)
    .limit(limit)
    .lean()

  // Thêm rank cho từng user
  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,
    user: entry.user,
    totalPoints: entry.totalPoints
  }))

  const total = await Point.countDocuments()

  return {
    leaderboard: leaderboardWithRank,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * LEADERBOARD ĐIỂM TUẦN
 * Hiển thị top users trong tuần này
 */
export const getWeeklyLeaderboard = async (
  options: LeaderboardOptions = {}
) => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  const leaderboard = await Point.find()
    .populate('user', 'username email')
    .select('user weeklyPoints')
    .sort({ weeklyPoints: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,
    user: entry.user,
    weeklyPoints: entry.weeklyPoints
  }))

  const total = await Point.countDocuments()

  return {
    leaderboard: leaderboardWithRank,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * LEADERBOARD ĐIỂM THÁNG
 * Hiển thị top users trong tháng này
 */
export const getMonthlyLeaderboard = async (
  options: LeaderboardOptions = {}
) => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  const leaderboard = await Point.find()
    .populate('user', 'username email')
    .select('user monthlyPoints')
    .sort({ monthlyPoints: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,
    user: entry.user,
    monthlyPoints: entry.monthlyPoints
  }))

  const total = await Point.countDocuments()

  return {
    leaderboard: leaderboardWithRank,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * LEADERBOARD STREAK
 * Hiển thị top users theo current streak
 */
export const getStreakLeaderboard = async (
  options: LeaderboardOptions = {}
) => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  const leaderboard = await Streak.find()
    .populate('user', 'username email')
    .select('user currentStreak longestStreak')
    .sort({ currentStreak: -1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,
    user: entry.user,
    currentStreak: entry.currentStreak,
    longestStreak: entry.longestStreak
  }))

  const total = await Streak.countDocuments()

  return {
    leaderboard: leaderboardWithRank,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * LEADERBOARD FASTEST QUIZ COMPLETION
 * Hiển thị top users hoàn thành quiz nhanh nhất (theo topic)
 */
export const getFastestQuizLeaderboard = async (
  topicId: string,
  options: LeaderboardOptions = {}
) => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  // Tìm quiz nhanh nhất của mỗi user cho topic này
  const leaderboard = await QuizResult.aggregate([
    {
      $match: {
        topic: new mongoose.Types.ObjectId(topicId),
        completionTime: { $exists: true, $gt: 0 }
      }
    },
    {
      $sort: { completionTime: 1 }
    },
    {
      $group: {
        _id: '$user',
        fastestTime: { $first: '$completionTime' },
        score: { $first: '$score' },
        createdAt: { $first: '$createdAt' }
      }
    },
    {
      $sort: { fastestTime: 1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        user: {
          _id: '$user._id',
          username: '$user.username',
          email: '$user.email'
        },
        fastestTime: 1,
        score: 1,
        createdAt: 1
      }
    }
  ])

  const leaderboardWithRank = leaderboard.map((entry, index) => ({
    rank: skip + index + 1,
    user: entry.user,
    fastestTime: entry.fastestTime,
    score: entry.score,
    date: entry.createdAt
  }))

  // Đếm tổng số users đã làm quiz này
  const total = await QuizResult.distinct('user', {
    topic: topicId,
    completionTime: { $exists: true, $gt: 0 }
  }).then((users) => users.length)

  return {
    leaderboard: leaderboardWithRank,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * LẤY RANK CỦA USER HIỆN TẠI
 * Tìm vị trí của user trong leaderboard
 */
export const getUserRank = async (
  userId: string | mongoose.Types.ObjectId,
  type: 'total' | 'weekly' | 'monthly' | 'streak' = 'total'
) => {
  let field: string
  let model: any

  switch (type) {
  case 'weekly':
    field = 'weeklyPoints'
    model = Point
    break
  case 'monthly':
    field = 'monthlyPoints'
    model = Point
    break
  case 'streak':
    field = 'currentStreak'
    model = Streak
    break
  default:
    field = 'totalPoints'
    model = Point
  }

  // Lấy điểm/streak của user hiện tại
  const userRecord = await model
    .findOne({ user: userId })
    .select(field)
    .lean()

  if (!userRecord) {
    return {
      rank: null,
      value: 0,
      message: 'User chưa có dữ liệu'
    }
  }

  const userValue = userRecord[field]

  // Đếm số users có điểm/streak cao hơn
  const rank =
    (await model.countDocuments({
      [field]: { $gt: userValue }
    })) + 1

  return {
    rank,
    value: userValue,
    type
  }
}
