import express from "express";
import { validateTokenMiddleware } from "../middleware/validateTokenMiddleware";
import { authorizeRoleMiddleware } from "../middleware/authorizeRoleMiddleware";
import { LoginController } from "../controllers/login/LoginController";
import { ProgressController } from "../controllers/progress/ProgressController";
import { StackbyController } from "../controllers/stackby/StackbyController";
import prisma from '../../client'
import { Router } from 'express';
import { Flagsmith } from 'flagsmith-nodejs';
import { ThemeController } from "../controllers/theme/ThemeController";
import { TopicController } from "../controllers/topic/TopicController";
import { ExerciseController } from "../controllers/exercise/ExerciseController";

if (!process.env.FLAGSMITH_SERVER_KEY) {
  throw new Error("FATAL: A variável de ambiente FLAGSMITH_SERVER_KEY não está definida.");
}

const flagsmith = new Flagsmith({
  environmentKey: process.env.FLAGSMITH_SERVER_KEY!,
});

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to the homepage");
});

router.post("/login", (req, res) =>
  new LoginController().registerUser(req, res)
);

router.get("/themes", async (req, res) => {
  new ThemeController().getThemes(req, res);
});

router.get("/themes/:id", async (req, res) => {
  new ThemeController().getThemeById(req, res);
});

router.get("/topics", async (req, res) => {
  new TopicController().getAllTopics(req, res);
});

router.get("/topics/:id", async (req, res) => {
  new TopicController().getTopicById(req, res);
});

router.get("/exercises", async (req, res) => {
  new ExerciseController().getAllExercises(req, res);
});

router.get("/exercises/:id", async (req, res) => {
  new ExerciseController().getExerciseById(req, res);
});

router.get("/stackby/:endpoint", (req, res, next) =>
  new StackbyController().getStackbyData(req, res, next)
);

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

router.use(authorizeRoleMiddleware)

router.post("/themes", async (req, res) => {
  new ThemeController().createTheme(req, res)
});


export default router;


