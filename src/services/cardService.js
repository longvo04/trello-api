import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

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

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'users')
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
        updatedAt: new Date()
      })
    } else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else {
      updatedCard = await cardModel.update(cardId, updateData)
    }

    return updatedCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew,
  update
}