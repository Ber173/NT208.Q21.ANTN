// =======================================================
// POINT SERVICE
// =======================================================

import Point, { IPoint } from '~/models/point.model'
import mongoose from 'mongoose'

/**
 * Utility: Kiểm tra xem có cần reset điểm tuần không
 */
const needWeeklyReset = (lastReset: Date): boolean => {
  const now = new Date()
  const daysSinceReset = Math.floor(
    (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
  )
  return daysSinceReset >= 7
}

/**
 * Utility: Kiểm tra xem có cần reset điểm tháng không
 */
const needMonthlyReset = (lastReset: Date): boolean => {
  const now = new Date()
  return (
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  )
}

/**
 * Lấy điểm của user
 */
export const getUserPoints = async (
  userId: string | mongoose.Types.ObjectId
): Promise<IPoint | null> => {
  const points = await Point.findOne({ user: userId })

  return points
}

/**
 * Cộng điểm cho user
 * Logic:
 * - Nếu chưa có record → tạo mới với điểm ban đầu
 * - Nếu đã có → cộng dồn vào totalPoints, weeklyPoints, monthlyPoints
 * - Tự động reset weeklyPoints/monthlyPoints nếu đã qua tuần/tháng
 */
export const addPoints = async (
  userId: string | mongoose.Types.ObjectId,
  pointsToAdd: number
): Promise<IPoint> => {
  // Tìm điểm hiện tại của user
  const points = await Point.findOne({ user: userId })

  // Nếu chưa có record → tạo mới
  if (!points) {
    const newPoints = await Point.create({
      user: userId,
      totalPoints: pointsToAdd,
      weeklyPoints: pointsToAdd,
      monthlyPoints: pointsToAdd,
      lastWeekReset: new Date(),
      lastMonthReset: new Date()
    })
    return newPoints
  }

  // Kiểm tra có cần reset không
  const resetWeekly = needWeeklyReset(points.lastWeekReset)
  const resetMonthly = needMonthlyReset(points.lastMonthReset)

  // Chuẩn bị update object
  const updateData: any = {
    $inc: { totalPoints: pointsToAdd }
  }

  if (resetWeekly) {
    // Reset điểm tuần
    updateData.weeklyPoints = pointsToAdd
    updateData.lastWeekReset = new Date()
  } else {
    // Cộng dồn điểm tuần
    updateData.$inc.weeklyPoints = pointsToAdd
  }

  if (resetMonthly) {
    // Reset điểm tháng
    updateData.monthlyPoints = pointsToAdd
    updateData.lastMonthReset = new Date()
  } else {
    // Cộng dồn điểm tháng
    updateData.$inc.monthlyPoints = pointsToAdd
  }

  // Cập nhật database
  const updatedPoints = await Point.findOneAndUpdate(
    { user: userId },
    updateData,
    { new: true }
  )

  return updatedPoints!
}

/**
 * Tạo record điểm mới cho user (chỉ dùng khi register)
 */
export const createUserPoints = async (
  userId: string | mongoose.Types.ObjectId
): Promise<IPoint> => {
  const newPoints = await Point.create({
    user: userId,
    totalPoints: 0,
    weeklyPoints: 0,
    monthlyPoints: 0,
    lastWeekReset: new Date(),
    lastMonthReset: new Date()
  })

  return newPoints
}
