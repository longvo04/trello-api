import express from 'express'
import { invitationValidation } from '../../validations/invitationValidation'
import { invitationController } from '../../controllers/invitationController.js'
import { authMiddleware } from '../../middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidation.createNewBoardInvitation, invitationController.createNewBoardInvitation)

Router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getBoardInvitations)
export const invitationRoute = Router
