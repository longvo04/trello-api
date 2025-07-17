import express from 'express'
import { boardRoute } from './boardRoute.js'
const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API v1' })
})

Router.use('/boards', boardRoute)

export const APIs_V1 = Router