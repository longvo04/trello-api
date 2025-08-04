import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt', 'boardId']

const validateBeforeInsert = async (data) => {
  try {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async (data) => {
  try {
    const validData = await validateBeforeInsert(data)
    const columnData = {
      ...validData,
      boardId: new ObjectId(String(validData.boardId))
    }
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).insertOne(columnData)
  } catch (error) { throw new Error(error) }
}

const findOneById = async (columnId) => {
  try {
    return await GET_DB().collection(COLUMN_COLLECTION_NAME).findOne({ _id: new ObjectId(String(columnId)) })
  } catch (error) { throw new Error(error)}
}

const pushCardIdToColumn = async (card) => {
  try {
    const columnId = card.columnId
    const cardId = card._id

    if (!columnId || !cardId) {
      throw new Error('Column ID and Card ID are required')
    }

    const updateResult = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(columnId)) },
      { $push: { cardOrderIds: new ObjectId(String(cardId)) } },
      { returnDocument: 'after' }
    )

    return updateResult
  } catch (error) {
    throw new Error(`Failed to push card ID to column: ${error.message}`)
  }
}

const update = async (columnId, updateData) => {
  try {
    // Validate updateData to ensure it does not contain invalid fields
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
      if (fieldName === 'cardOrderIds') {
        updateData.cardOrderIds = updateData.cardOrderIds.map(id => new ObjectId(String(id)))
      }
    })
    if (!columnId) {
      throw new Error('Column ID is required')
    }
    const updatedColumn = await GET_DB().collection(COLUMN_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(String(columnId)) },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    return updatedColumn
  } catch (error) {
    throw new Error(`Failed to update column: ${error.message}`)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardIdToColumn,
  update
}