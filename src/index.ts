import "reflect-metadata";
import express from "express";
import router from "./routes/index";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import cors from "cors";

const PORT = 5002;
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(router);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "Not Found",
    message: "A rota que você tentou acessar não existe.",
  });
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});