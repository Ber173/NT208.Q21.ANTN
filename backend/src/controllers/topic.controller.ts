// =======================================================
// TOPIC CONTROLLER
// =======================================================

import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as topicService from '~/services/topic.service'

/**
 * @route   GET /api/v1/topics
 * @desc    Lấy danh sách tất cả topics với pagination
 * @access  Public
 */
export const getAllTopics = async (req: Request, res: Response) => {
  try {
    // Lấy page và limit từ query params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    // Gọi service
    const result = await topicService.getAllTopics({ page, limit })

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Topics retrieved successfully',
      data: result
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get topics',
      error: error.message
    })
  }
}

/**
 * @route   GET /api/v1/topics/:topicId
 * @desc    Lấy topic theo ID
 * @access  Public
 */
export const getTopicById = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params

    const topic = await topicService.getTopicById(topicId)

    if (!topic) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Topic not found'
      })
      return
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Topic retrieved successfully',
      data: topic
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get topic',
      error: error.message
    })
  }
}

/**
 * @route   GET /api/v1/topics/:topicId/vocabularies
 * @desc    Lấy từ vựng theo topic
 * @query   ?page=1&limit=20 (pagination)
 * @query   ?random=true&count=10 (random để làm quiz)
 * @access  Public
 */
export const getVocabulariesByTopic = async (
  req: Request,
  res: Response
) => {
  try {
    const { topicId } = req.params

    // Check nếu muốn random
    const random = req.query.random === 'true'
    const randomCount = parseInt(req.query.count as string) || 10

    // Pagination params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20

    // Gọi service với options phù hợp
    const result = await topicService.getVocabulariesByTopic(topicId, {
      random,
      randomCount,
      page,
      limit
    })

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Vocabularies retrieved successfully',
      data: result
    })
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get vocabularies',
      error: error.message
    })
  }
}
