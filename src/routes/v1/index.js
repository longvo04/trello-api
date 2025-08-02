import express from 'express'
import { boardRoute } from './boardRoute.js'
import { columnRoute } from './columnRoute.js'
import { cardRoute } from './cardRoute.js'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API v1' })
})

Router.use('/boards', boardRoute)
Router.use('/columns', columnRoute)
Router.use('/cards', cardRoute)

export const APIs_V1 = Router