import express from 'express'
import { StatusCodes } from 'http-status-codes'
const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Welcome to the Board API' })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({ message: 'Board created successfully' })
  }
)
export const boardRoute = Router