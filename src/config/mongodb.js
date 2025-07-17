/* eslint-disable no-console */
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment.js'

const MONGODB_URI = env.MONGODB_URI || 'mongodb://localhost:27017'
const DATABASE_NAME = env.DATABASE_NAME || 'myDatabase'
let trelloDatabaseInstance = null
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})


export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
  console.log('MongoDB client closed.')
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Database connection is not established')
  return trelloDatabaseInstance
}
