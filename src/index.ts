import express from 'express'
import router from './routes/index'
import { customCors } from './middleware/cors'

const app = express()
const port = 5002

app.use(customCors); 

app.use(express.json())

app.use('/', router)
app.use('/user', router)
app.use('/login', router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
