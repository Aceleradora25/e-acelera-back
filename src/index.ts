import express from "express";
import router from "./routes/index";

const app = express();
const port = 5002;

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
