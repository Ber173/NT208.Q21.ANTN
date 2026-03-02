// =======================================================
// TOPIC ROUTES
// =======================================================

import { Router } from 'express'
import * as topicController from '~/controllers/topic.controller'

const router: Router = Router()

// =======================================================
// PUBLIC ROUTES (không cần JWT)
// =======================================================

/**
 * GET /api/v1/topics
 * Lấy tất cả topics với pagination
 */
router.get('/', topicController.getAllTopics)

/**
 * GET /api/v1/topics/:topicId
 * Lấy topic theo ID
 */
router.get('/:topicId', topicController.getTopicById)

/**
 * GET /api/v1/topics/:topicId/vocabularies
 * Lấy từ vựng theo topic
 * Query params:
 *   - page, limit (pagination)
 *   - random=true&count=10 (random để làm quiz)
 */
router.get(
  '/:topicId/vocabularies',
  topicController.getVocabulariesByTopic
)

export default router
