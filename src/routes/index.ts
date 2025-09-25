import express from "express";
import { validateTokenMiddleware } from "../middleware/validateTokenMiddleware";
import { LoginController } from "../controllers/login/LoginController";
import { ProgressController } from "../controllers/progress/ProgressController";
import { StackbyController } from "../controllers/stackby/StackbyController";
import { getGithubApi } from "../controllers/poc-test-github-api/poc-github";

const router = express.Router();

router.get("/",
  (req, res) => {
    res.send("Welcom  e to the homepage");
});

// getGitHubAPI
router.get("/github/:folder", async (req, res) => {
  try {
    const { folder } = req.params;
    const baseUrl = "https://api.github.com/repos/TiciB/poc-eacelera/contents";

    const url = `${baseUrl}/${folder}`;
    console.log(url);
    

    const allFiles = await getGithubApi(url);
    res.json(allFiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});
//

router.post("/login",
  (req, res) =>
    new LoginController().registerUser(req, res)
);

router.get("/stackby/:endpoint",
  (req, res) =>
    new StackbyController().getStackbyData(req, res)
);

router.get("/themes",
  (req, res) =>
    new StackbyController().getFilteredThemes(req, res)
);

router.use(validateTokenMiddleware);

router.get("/status/:id/:idType",
  (req, res) =>
    new ProgressController().getTopicExercisesStatusProgress(req, res)
);

router.put("/status/:topicId/item/:itemId",
  (req, res) =>
    new ProgressController().saveStatusProgress(req, res)
);

router.get("/status/:topicId/item/:itemId",
  (req, res) =>
    new ProgressController().getExerciseStatusProgress(req, res)
);

router.get("/progress/:id/:idType",
  (req, res) =>
    new ProgressController().getProgressPercentageById(req, res)
);

router.get(
  "/themes/progress",
  (req, res) =>
    new ProgressController().getThemeProgress(req, res)
);

export default router;