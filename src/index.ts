import express from 'express'
import router from './routes/index'
import cors from 'cors'

const app = express()
const port = 5002

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use(router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
