import { invitationModel } from '~/models/invitationModel.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import { boardModel } from '~/models/boardModel'
import { pickUser } from '~/utils/formatters'
import { INVITATION_TYPES, BOARD_INVITATION_STATUS } from '~/utils/constants'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    const board = await boardModel.findOneById(reqBody.boardId)

    if (!inviter || !invitee || !board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Inviter, Invitee or Board Not Found!')
    }

    // if (inviter._id.equals(invitee._id)) {
    //   throw new ApiError(StatusCodes.CONFLICT, 'Invalid email address')
    // }

    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNewBoardInvitation(newInvitationData)
    const getInvitation = await invitationModel.findOneById(createdInvitation.insertedId)

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return resInvitation
  } catch (error) { throw new Error(error) }
}

const getBoardInvitations = async (userId) => {
  try {
    const boardInvitations = await invitationModel.getUserBoardInvitations(userId)

    const resInvitations = boardInvitations.map(invitation => ({
      ...invitation,
      inviter: invitation?.inviter[0] || {},
      board: invitation?.board[0] || {},
      invitee: invitation?.invitee[0] || {}
    }))
    return resInvitations
  } catch (error) { throw new Error(error) }
}

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId)
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Invitation Not Found!')
    }
    const boardId = getInvitation.boardInvitation.boardId

    const board = await boardModel.findOneById(boardId)

    const memberList = [...board.ownerIds, ...board.memberIds].toString()
    if (status === BOARD_INVITATION_STATUS.ACCEPTED && memberList.includes(getInvitation.inviteeId.toString())) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'You are already a member of this board')
    }

    const updateInvitationData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status
      }
    }

    const updatedInvitation = await invitationModel.update(invitationId, updateInvitationData)

    if (status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(boardId, userId)
    }

    return updatedInvitation
  } catch (error) { throw new Error(error) }
}

export const invitationService = {
  createNewBoardInvitation,
  getBoardInvitations,
  updateBoardInvitation
}
