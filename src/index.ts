import express from "express";
import router from "./routes/index";

const app = express();
const port = 5002;

app.use(express.json());
app.use(router);

app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: "Not Found",
    message: "The requested route does not exist."
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
