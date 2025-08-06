import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']


const validateBeforeInsert = async (data) => {
  try {
    return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeInsert(data)
    const cardData = {
      ...validData,
      boardId: new ObjectId(String(validData.boardId)),
      columnId: new ObjectId(String(validData.columnId))
    }
    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(cardData)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (cardId) => {
  try {
    return await GET_DB().collection(CARD_COLLECTION_NAME).findOne({ _id: new ObjectId(String(cardId)) })
  } catch (error) { throw new Error(error)}
}

const update = async (cardId, updateData) => {
  try {
    // Validate updateData to ensure it does not contain invalid fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
      if (fieldName === 'columnId') {
        updateData.columnId = new ObjectId(String(updateData.columnId))
      }
    })
    if (!cardId) {
      throw new Error('Card ID is required')
    }
    const updatedCard = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(cardId)) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return updatedCard
  } catch (error) {
    throw new Error(`Failed to update card: ${error.message}`)
  }
}

const deleteManyByColumnId = async (columnId) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({ columnId: new ObjectId(String(columnId)) })
    return result
  } catch (error) {
    throw new Error(`Failed to delete cards by column ID: ${error.message}`)
  }
}

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}