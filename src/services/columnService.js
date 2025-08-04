import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'
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
      throw new ApiError(404, 'Column not found')
    }
    return updatedColumn
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update
}