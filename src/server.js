/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from './config/environment.js'
import { APIs_V1 } from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cors from 'cors'
import { corsOptions } from './config/cors'
import cookieParser from 'cookie-parser'

import http from 'http'
import socketIo from 'socket.io'
import { boardInvitationSocket } from './sockets/notificationSocket'

const hostname = env.APP_HOST
const port = env.APP_PORT

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)

  const server = http.createServer(app)
  const io = new socketIo.Server(server, { cors: corsOptions })

  io.on('connection', (socket) => {
    boardInvitationSocket(socket)
  })

  if (env.BUILD_MODE === 'production') {
    server.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
      console.log(`Server is running at port ${ process.env.PORT }`)
    })
  } else {
    server.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
      console.log(`Server is running at http://${ hostname }:${ port }/`)
    })
  }

  exitHook(() => CLOSE_DB())
}

(async () => {
  try {
    console.log('Connecting to MongoDB...')
    await CONNECT_DB()
    console.log('Connected to MongoDB successfully.')
    START_SERVER()
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
})()
