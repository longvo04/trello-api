import { userModel } from '~/models/userModel.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAIN } from '~/utils/constants.js'
import { ResendProvider } from '~/providers/ResendProvider'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'

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

const verifyAccount = async (reqBody) => {
  const existUser = await userModel.findOneByEmail(reqBody.email)
  if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Account already verified')
  if (existUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid token')

  const updateData = {
    isActive: true,
    verifyToken: null,
    updatedAt: new Date()
  }

  const updatedUser = await userModel.update(existUser._id, updateData)

  return pickUser(updatedUser)
}

const login = async (reqBody) => {
  const existUser = await userModel.findOneByEmail(reqBody.email)
  if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
  const isPasswordValid = bcryptjs.compareSync(reqBody.password, existUser.password)
  if (!isPasswordValid) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
  if (!existUser.isActive) throw new ApiError(StatusCodes.FORBIDDEN, 'Account is not activated. Please verify your email before logging in')

  // Tạo token
  const userInfo = { _id: existUser._id, email: existUser.email }
  const accessToken = await JwtProvider.generateToken(
    userInfo,
    env.ACCESS_TOKEN_SECRET_SIGNATURE,
    5
    // env.ACCESS_TOKEN_LIFE
  )
  const refreshToken = await JwtProvider.generateToken(
    userInfo,
    env.REFRESH_TOKEN_SECRET_SIGNATURE,
    env.REFRESH_TOKEN_LIFE
  )
  return {
    accessToken,
    refreshToken,
    ...pickUser(existUser)
  }
}

export const userService = {
  createNew,
  verifyAccount,
  login
}