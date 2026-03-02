// =======================================================
// QUIZ ROUTES
// =======================================================

import { Router } from 'express'
import * as quizController from '~/controllers/quiz.controller'
import { protect } from '~/middlewares/auth.middleware'

const router: Router = Router()

// =======================================================
// PRIVATE ROUTES (cần JWT authentication)
// =======================================================

/**
 * POST /api/v1/quizzes/submit
 * Nộp bài quiz và nhận kết quả chấm điểm
 * Body: { topicId, answers: [{ vocabId, selectedAnswer }] }
 */
router.post('/submit', protect, quizController.submitQuiz)

/**
 * GET /api/v1/quizzes/history
 * Lấy lịch sử làm quiz của user
 * Query params: ?page=1&limit=10
 */
router.get('/history', protect, quizController.getQuizHistory)

export default router
