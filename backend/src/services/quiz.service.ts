// =======================================================
// QUIZ SERVICE
// =======================================================

import mongoose from 'mongoose'
import Vocabulary, { IVocabulary } from '~/models/vocabulary.model'
import QuizResult from '~/models/quizResult.model'
import { addPoints } from './point.service'
import { updateStreak } from './streak.service'

// ==============================
// Interface cho câu trả lời từ client
// ==============================
interface UserAnswer {
  vocabId: string
  selectedAnswer: string
}

// ==============================
// Interface cho kết quả submit quiz
// ==============================
interface QuizSubmitResult {
  totalQuestions: number
  correctAnswers: number
  score: number
  incorrectAnswers: Array<{
    vocabId: string
    word: string
    yourAnswer: string
    correctAnswer: string
  }>
  pointsEarned: number
  streak: {
    currentStreak: number
    longestStreak: number
  }
}

/**
 * CHẤM ĐIỂM QUIZ
 *
 * Flow:
 * 1. Lấy đáp án đúng từ database (KHÔNG TIN CLIENT)
 * 2. So sánh từng câu trả lời
 * 3. Tính điểm (mỗi câu đúng = 10 điểm)
 * 4. Lưu kết quả vào QuizResult
 * 5. Cộng điểm vào Points
 * 6. Cập nhật Streak
 */
export const submitQuiz = async (
  userId: string | mongoose.Types.ObjectId,
  topicId: string,
  userAnswers: UserAnswer[]
): Promise<QuizSubmitResult> => {
  // Bước 1: Lấy danh sách vocabId từ câu trả lời của user
  const vocabIds = userAnswers.map((ans) => ans.vocabId)

  // Bước 2: Lấy đáp án ĐÚNG từ database
  // (QUAN TRỌNG: không tin dữ liệu client gửi lên)
  const vocabularies = await Vocabulary.find({
    _id: { $in: vocabIds }
  }).select('_id word meaning')

  // Tạo map để tra cứu nhanh: vocabId → đáp án đúng
  const vocabMap = new Map<string, IVocabulary>()
  vocabularies.forEach((vocab) => {
    vocabMap.set(vocab._id.toString(), vocab)
  })

  // Bước 3: Chấm từng câu
  let correctCount = 0
  const detailedAnswers: any[] = []
  const incorrectAnswers: any[] = []

  userAnswers.forEach((userAns) => {
    const vocab = vocabMap.get(userAns.vocabId)
    if (!vocab) return // Bỏ qua nếu vocabId không hợp lệ

    const correctAnswer = vocab.meaning.toLowerCase().trim()
    const selectedAnswer = userAns.selectedAnswer.toLowerCase().trim()
    const isCorrect = selectedAnswer === correctAnswer

    if (isCorrect) {
      correctCount++
    } else {
      // Lưu danh sách câu sai
      incorrectAnswers.push({
        vocabId: userAns.vocabId,
        word: vocab.word,
        yourAnswer: userAns.selectedAnswer,
        correctAnswer: vocab.meaning
      })
    }

    // Lưu chi tiết tất cả câu trả lời (để lưu vào DB)
    detailedAnswers.push({
      vocabId: userAns.vocabId,
      selectedAnswer: userAns.selectedAnswer,
      correctAnswer: vocab.meaning,
      isCorrect
    })
  })

  // Bước 4: Tính điểm
  const POINTS_PER_QUESTION = 10
  const totalQuestions = userAnswers.length
  const score = correctCount * POINTS_PER_QUESTION

  // Bước 5: Lưu kết quả quiz vào database
  await QuizResult.create({
    user: userId,
    topic: topicId,
    totalQuestions,
    correctAnswers: correctCount,
    score,
    answers: detailedAnswers
  })

  // Bước 6: Cộng điểm cho user
  await addPoints(userId, score)

  // Bước 7: Cập nhật streak
  const streak = await updateStreak(userId)

  // Trả về kết quả
  return {
    totalQuestions,
    correctAnswers: correctCount,
    score,
    incorrectAnswers,
    pointsEarned: score,
    streak: {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak
    }
  }
}

/**
 * Lấy lịch sử làm quiz của user
 */
export const getUserQuizHistory = async (
  userId: string | mongoose.Types.ObjectId,
  options: { page?: number; limit?: number } = {}
) => {
  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  const results = await QuizResult.find({ user: userId })
    .populate('topic', 'name')
    .select('topic totalQuestions correctAnswers score createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const total = await QuizResult.countDocuments({ user: userId })

  return {
    results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}
