import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

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

export const columnService = {
  createNew
}