import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async (card) => {
  try {
    const newCardData = {
      ...card
    }
    const createdCard = await cardModel.createNew(newCardData)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      getNewCard.cards = []
      await columnModel.pushCardIdToColumn(getNewCard)
    }

    return getNewCard
  } catch (error) { throw error }

}

const update = async (cardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    const updatedCard = await cardModel.update(cardId, updateData)
    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}