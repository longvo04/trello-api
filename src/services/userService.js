import { userModel } from '~/models/userModel.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants.js'
import { ResendProvider } from '~/providers/resendProvider'

const createNew = async (reqBody) => {
  const existUser = await userModel.findOneByEmail(reqBody.email)
  if (existUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already exists')
  }

  const nameFromEmail = reqBody.email.split('@')[0]
  const newUserData = {
    email: reqBody.email,
    password: bcryptjs.hashSync(reqBody.password, 8),
    username: nameFromEmail,
    displayName: nameFromEmail,
    verifyToken: uuidv4()
  }

  const createdUser = await userModel.createNew(newUserData)
  const getNewUser = await userModel.findOneById(createdUser.insertedId)

  const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
  const mailSubject = 'Welcome to Trello Web: Please verify your email address before using our services'
  const mailContent = `
    <h1>Welcome to Trello</h1>
    <p>Hi ${getNewUser.displayName},</p>
    <p>Thank you for signing up for Trello! Please confirm your email address by clicking the link below:</p>
    <h3>${verificationLink}</h3>
  `
  const data = await ResendProvider.sendEmail({ to: getNewUser.email, subject: mailSubject, html: mailContent })
  // eslint-disable-next-line no-console
  console.log('ResendProvider data: ', data)
  return pickUser(getNewUser)
}

export const userService = {
  createNew
}