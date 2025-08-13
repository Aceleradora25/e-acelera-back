import express from "express";
import { validateTokenMiddleware } from "../middleware/validateTokenMiddleware";
import { LoginController } from "../controllers/login/LoginController";
import { ProgressController } from "../controllers/progress/ProgressController";
import { StackbyController } from "../controllers/stackby/StackbyController";

const router = express.Router();

router.get("/", 
  (req, res) => {
    res.send("Welcome to the homepage");
});

router.post("/login",
  (req, res) =>
    new LoginController().registerUser(req, res)
);

router.get("/stackBy/:endpoint", 
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

export default router;