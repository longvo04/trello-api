/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'

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
    return await boardModel.getDetails(boardId)
  } catch (error) { throw error }

}

export const boardService = {
  createNew,
  getDetails
}