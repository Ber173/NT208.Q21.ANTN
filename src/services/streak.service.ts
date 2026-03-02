// =======================================================
// STREAK SERVICE
// =======================================================

import Streak, { IStreak } from '~/models/streak.model'
import mongoose from 'mongoose'

/**
 * Utility: So sánh 2 ngày có cùng ngày không (bỏ qua giờ)
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Utility: Kiểm tra date1 có là ngày hôm qua của date2 không
 */
const isYesterday = (date1: Date, date2: Date): boolean => {
  const yesterday = new Date(date2)
  yesterday.setDate(yesterday.getDate() - 1)

  return isSameDay(date1, yesterday)
}

/**
 * Lấy thông tin streak của user
 */
export const getUserStreak = async (
  userId: string | mongoose.Types.ObjectId
): Promise<IStreak | null> => {
  const streak = await Streak.findOne({ user: userId })

  return streak
}

/**
 * Cập nhật streak khi user học hôm nay
 *
 * Logic chi tiết:
 * 1. Nếu chưa có record → tạo mới với streak = 1
 * 2. Nếu đã học hôm nay rồi → không làm gì (return luôn)
 * 3. Nếu hôm qua đã học → tăng currentStreak lên 1
 * 4. Nếu hôm qua KHÔNG học → reset currentStreak = 1
 * 5. Cập nhật longestStreak nếu currentStreak > longestStreak
 * 6. Tăng totalDaysStudied (tổng số ngày đã học)
 */
export const updateStreak = async (
  userId: string | mongoose.Types.ObjectId
): Promise<IStreak> => {
  // Lấy ngày hôm nay (set giờ về 00:00:00 để tránh bug timezone)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Tìm streak record của user
  let streak = await Streak.findOne({ user: userId })

  // Case 1: Chưa có record → tạo mới
  if (!streak) {
    streak = await Streak.create({
      user: userId,
      currentStreak: 1,
      longestStreak: 1,
      lastStudyDate: today,
      totalDaysStudied: 1
    })
    return streak
  }

  // Lấy lastStudyDate và set giờ về 00:00:00
  const lastStudy = new Date(streak.lastStudyDate)
  lastStudy.setHours(0, 0, 0, 0)

  // Case 2: Đã học hôm nay rồi → không làm gì
  if (isSameDay(lastStudy, today)) {
    return streak
  }

  // Tăng total days studied (vì đây là ngày học mới)
  streak.totalDaysStudied += 1

  // Case 3: Hôm qua đã học → tăng streak
  if (isYesterday(lastStudy, today)) {
    streak.currentStreak += 1
  } else {
    // Case 4: Hôm qua không học → reset streak
    streak.currentStreak = 1
  }

  // Cập nhật longestStreak nếu cần
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak
  }

  // Cập nhật lastStudyDate
  streak.lastStudyDate = today

  // Lưu vào database
  await streak.save()

  return streak
}
