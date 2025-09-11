import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'


const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const newInvitation = await invitationService.createNewBoardInvitation(req.body, inviterId)

    res.status(StatusCodes.CREATED).json(newInvitation)
  } catch (error) { next(error) }
}

const getBoardInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardInvitations = await invitationService.getBoardInvitations(userId)

    res.status(StatusCodes.OK).json(boardInvitations)
  } catch (error) { next(error) }
}

export const invitationController = {
  createNewBoardInvitation,
  getBoardInvitations
}
