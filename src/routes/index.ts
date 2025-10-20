import express from "express";
import { validateTokenMiddleware } from "../middleware/validateTokenMiddleware";
import { LoginController } from "../controllers/login/LoginController";
import { ProgressController } from "../controllers/progress/ProgressController";
import { StackbyController } from "../controllers/stackby/StackbyController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the homepage");
});

router.get("/themes", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM themes ORDER BY sequence");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar os temas" });
  }
});

router.post("/login", (req, res) =>
  new LoginController().registerUser(req, res)
);

/* router.get("/stackby/:endpoint", (req, res, next) =>
  new StackbyController().getStackbyData(req, res, next)
);
*/

// router.get("/themes",
//   (req, res) =>
//     new StackbyController().getFilteredThemes(req, res)
// );

router.use(validateTokenMiddleware);

router.get("/status/:id/:idType", (req, res) =>
  new ProgressController().getTopicExercisesStatusProgress(req, res)
);

router.put("/status/:topicId/item/:itemId", (req, res) =>
  new ProgressController().saveStatusProgress(req, res)
);

router.get("/status/:topicId/item/:itemId", (req, res) =>
  new ProgressController().getExerciseStatusProgress(req, res)
);

router.get("/progress/:id/:idType", (req, res) =>
  new ProgressController().getProgressPercentageById(req, res)
);

router.get("/themes/progress", (req, res) =>
  new ProgressController().getThemeProgress(req, res)
);

export default router;
