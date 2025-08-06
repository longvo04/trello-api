import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createNew = async (column) => {
  try {
    const newColumnData = {
      ...column
    }
    const createdColumn = await columnModel.createNew(newColumnData)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []
      await boardModel.pushColumnIdToBoard(getNewColumn)
    }

    return getNewColumn
  } catch (error) { throw error }

}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)
    if (!updatedColumn) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }
    return updatedColumn
  } catch (error) { throw error }
}

const deleteColumn = async (columnId) => {
  try {
    const column = await columnModel.findOneById(columnId)
    if (!column) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Column not found')
    }

    await columnModel.deleteOneById(columnId)

    await cardModel.deleteManyByColumnId(columnId)

    await boardModel.pullColumnIdFromBoard(column)

    return { message: 'Column deleted successfully' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteColumn
}