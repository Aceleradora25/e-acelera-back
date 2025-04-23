import express from "express"
import router from "./routes/index"
import { corsMiddleware } from "./middleware/corsMiddleware"
import { Request, Response, NextFunction } from "express"

const app = express()
const port = 5002

app.use((req: Request, res: Response, next: NextFunction) => corsMiddleware(req, res, next))

app.use(express.json())

app.use("/", router)
app.use("/user", router)
app.use("/login", router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
