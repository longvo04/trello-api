import express from 'express'
import { invitationValidation } from '../../validations/invitationValidation'
import { invitationController } from '../../controllers/invitationController.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidation.createNewBoardInvitation, invitationController.createNewBoardInvitation)
  .put(authMiddleware.isAuthorized, invitationValidation.updateBoardInvitation, invitationController.updateBoardInvitation)

Router.route('/board/:invitationId')
  .put(authMiddleware.isAuthorized, invitationValidation.updateBoardInvitation, invitationController.updateBoardInvitation)

Router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getBoardInvitations)
export const invitationRoute = Router
