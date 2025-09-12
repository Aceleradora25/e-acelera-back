import "reflect-metadata";
import express from "express";
import router from "./routes/index";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";

const app = express();
const port = 5002;

app.use(express.json());
app.use(router);
app.use(errorHandlerMiddleware);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "Not Found",
    message: "A rota que você tentou acessar não existe.",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
