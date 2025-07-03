import express from 'express'
const hostname = 'localhost'
const port = 8017

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})