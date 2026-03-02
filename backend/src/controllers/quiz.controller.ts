// =======================================================
// QUIZ CONTROLLER
// =======================================================

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as quizService from '~/services/quiz.service'

// Extend Request để có user từ auth middleware
interface AuthRequest extends Request {
  user?: any
}

/**
 * @route   POST /api/v1/quizzes/submit
 * @desc    Nộp bài quiz và nhận kết quả chấm điểm
 * @body    { topicId, answers: [{ vocabId, selectedAnswer }] }
 * @access  Private (cần JWT)
 */
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    // Lấy userId từ req.user (đã được set bởi auth middleware)
    const userId = req.user._id

    // Lấy dữ liệu từ request body
    const { topicId, answers } = req.body

    // Validate input
    if (!topicId || !answers || !Array.isArray(answers)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          'Invalid request. Please provide topicId and answers array.'
      })
      return
    }

    if (answers.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Answers array cannot be empty'
      })
      return
    }

    // Validate từng answer phải có vocabId và selectedAnswer
    for (const answer of answers) {
      if (!answer.vocabId || !answer.selectedAnswer) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message:
            'Each answer must have vocabId and selectedAnswer'
        })
        return
      }
    }

    // Gọi service để chấm điểm
    const result = await quizService.submitQuiz(
      userId,
      topicId,
      answers
    )

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: result
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    })
  }
}

/**
 * @route   GET /api/v1/quizzes/history
 * @desc    Lấy lịch sử làm quiz của user
 * @query   ?page=1&limit=10
 * @access  Private (cần JWT)
 */
export const getQuizHistory = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user._id

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const result = await quizService.getUserQuizHistory(userId, {
      page,
      limit
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Quiz history retrieved successfully',
      data: result
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get quiz history',
      error: error.message
    })
  }
}
