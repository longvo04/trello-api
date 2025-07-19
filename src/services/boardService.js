/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createNew = async (board) => {
  try {
    const createdBoard = {
      ...board,
      slug: slugify(board.title)
    }
    return createdBoard
  } catch (error) { throw error }

}

export const boardService = {
  createNew
}