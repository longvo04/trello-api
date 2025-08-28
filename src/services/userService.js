import { userModel } from '~/models/userModel.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'


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

  return pickUser(getNewUser)
}

export const userService = {
  createNew
}