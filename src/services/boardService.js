/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { cloneDeep } from 'lodash'
import ApiError from '~/utils/ApiError'

const createNew = async (board) => {
  try {
    const newBoard = {
      ...board,
      slug: slugify(board.title)
    }
    const createdBoard = await boardModel.createNew(newBoard)
    const result = await boardModel.findOneById(createdBoard.insertedId)
    return result
  } catch (error) { throw error }

}
const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(404, 'Board not found')
    }
    const result = cloneDeep(board)
    result.columns = result.columns.map(column => {
      column.cards = board.cards.filter(card => card.columnId.toString() === column._id.toString())
      return column
    })
    delete result.cards
    return result
  } catch (error) { throw error }

}

export const boardService = {
  createNew,
  getDetails
}