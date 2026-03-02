// =======================================================
// TOPIC SERVICE
// =======================================================

import Topic from '~/models/topic.model'
import Vocabulary from '~/models/vocabulary.model'

// ==============================
// Interface cho pagination options
// ==============================
interface PaginationOptions {
  page?: number
  limit?: number
}

// ==============================
// Interface cho vocabulary query options
// ==============================
interface VocabularyQueryOptions extends PaginationOptions {
  random?: boolean
  randomCount?: number
}

/**
 * Lấy tất cả topics với pagination
 */
export const getAllTopics = async (options: PaginationOptions = {}) => {
  const page = options.page || 1
  const limit = options.limit || 10

  // Tính số record cần skip
  const skip = (page - 1) * limit

  // Query topics với pagination
  const topics = await Topic.find()
    .select('_id name description createdAt')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

  // Đếm tổng số topics
  const total = await Topic.countDocuments()

  return {
    topics,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

/**
 * Lấy topic theo ID
 */
export const getTopicById = async (topicId: string) => {
  const topic = await Topic.findById(topicId).select(
    '_id name description createdAt'
  )

  return topic
}

/**
 * Lấy vocabularies theo topicId với các options
 */
export const getVocabulariesByTopic = async (
  topicId: string,
  options: VocabularyQueryOptions = {}
) => {
  // Nếu yêu cầu random để làm quiz
  if (options.random) {
    const count = options.randomCount || 10

    // Dùng MongoDB $sample để random
    const vocabularies = await Vocabulary.aggregate([
      { $match: { topic: topicId as any } },
      { $sample: { size: count } },
      {
        $project: {
          _id: 1,
          word: 1,
          meaning: 1
          // Chỉ trả về các field cần thiết
        }
      }
    ])

    return {
      vocabularies,
      isRandom: true,
      count: vocabularies.length
    }
  }

  // Trường hợp pagination bình thường
  const page = options.page || 1
  const limit = options.limit || 20

  const skip = (page - 1) * limit

  // Query vocabularies với pagination
  const vocabularies = await Vocabulary.find({ topic: topicId })
    .select('_id word meaning')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: 1 })

  // Đếm tổng số từ vựng trong topic
  const total = await Vocabulary.countDocuments({ topic: topicId })

  return {
    vocabularies,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}
