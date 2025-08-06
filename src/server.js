/* eslint-disable no-console */
import express from 'express'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import exitHook from 'async-exit-hook'
import { env } from './config/environment.js'
import { APIs_V1 } from './routes/v1/index.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cors from 'cors'
import { corsOptions } from './config/cors'
const app = express()

const hostname = env.APP_HOST
const port = env.APP_PORT

const START_SERVER = () => {
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/v1', APIs_V1)
  app.use(errorHandlingMiddleware)
  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.port, () => {
    // eslint-disable-next-line no-console
      console.log(`Server is running at port ${ process.env.port }`)
    })
  } else {
    app.listen(port, hostname, () => {
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