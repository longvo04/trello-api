/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

const createNew = async (userId, board) => {
  try {
    const newBoard = {
      ...board,
      slug: slugify(board.title)
    }
    const createdBoard = await boardModel.createNew(userId, newBoard)
    const result = await boardModel.findOneById(createdBoard.insertedId)
    return result
  } catch (error) { throw new Error(error) }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    const result = cloneDeep(board)
    result.columns = result.columns.map(column => {
      column.cards = board.cards.filter(card => card.columnId.toString() === column._id.toString())
      return column
    })
    delete result.cards
    return result
  } catch (error) { throw new Error(error) }
}


const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)
    if (!updatedBoard) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }
    return updatedBoard
  } catch (error) { throw new Error(error) }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    const { cardId, fromColumnId, fromColumnOrderIds, toColumnId, toColumnOrderIds } = reqBody
    // Update Previous Column
    await columnModel.update(fromColumnId, { cardOrderIds: fromColumnOrderIds })
    // Update New Column
    await columnModel.update(toColumnId, { cardOrderIds: toColumnOrderIds })

    await cardModel.update(cardId, { columnId: toColumnId })

    return { returnResult: 'Card moved successfully' }
  } catch (error) { throw new Error(error) }
}

const getBoards = async (userId, page, itemsPerPage, queryFilters) => {
  try {
    const pageNumber = parseInt(page, 10) || DEFAULT_PAGE
    const limit = parseInt(itemsPerPage, 10) || DEFAULT_ITEMS_PER_PAGE
    const result = await boardModel.getBoards(userId, pageNumber, limit, queryFilters)

    return result
  } catch (error) { throw new Error(error) }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards
}
