import express from "express";
import { Flagsmith } from "flagsmith-nodejs";
import { ExerciseController } from "../controllers/exercise/ExerciseController.js";
import { LoginController } from "../controllers/login/LoginController.js";
import { ProgressController } from "../controllers/progress/ProgressController.js";
import { StackbyController } from "../controllers/stackby/StackbyController.js";
import { ThemeController } from "../controllers/theme/ThemeController";
import { TopicController } from "../controllers/topic/TopicController";
import { validateTokenMiddleware } from "../middleware/validateTokenMiddleware";

if (!process.env.FLAGSMITH_SERVER_KEY) {
	throw new Error(
		"FATAL: A variável de ambiente FLAGSMITH_SERVER_KEY não está definida.",
	);
}

new Flagsmith({
	// biome-ignore lint/style/noNonNullAssertion: TODO: Remover non null assertion
	environmentKey: process.env.FLAGSMITH_SERVER_KEY!,
});

const router = express.Router();

router.get("/", (_, res) => {
	res.send("Welcome to the homepage");
});

router.post("/login", (req, res) =>
	new LoginController().registerUser(req, res),
);

router.get("/themes", (req, res) => {
	new ThemeController().getThemes(req, res);
});

router.get("/themes/:id", (req, res) => {
	new ThemeController().getThemeById(req, res);
});

router.get("/topics", (req, res) => {
	new TopicController().getAllTopics(req, res);
});

router.get("/topics/:id", (req, res) => {
	new TopicController().getTopicById(req, res);
});

router.get("/exercises", (req, res) => {
	new ExerciseController().getAllExercises(req, res);
});

router.get("/exercises/:id", (req, res) => {
	new ExerciseController().getExerciseById(req, res);
});

router.get("/stackby/:endpoint", (req, res, next) =>
	new StackbyController().getStackbyData(req, res, next),
);

router.use(validateTokenMiddleware);

router.get("/status/:id/:idType", (req, res) =>
	new ProgressController().getTopicExercisesStatusProgress(req, res),
);

router.put("/status/:topicId/item/:itemId", (req, res) =>
	new ProgressController().saveStatusProgress(req, res),
);

router.get("/status/:topicId/item/:itemId", (req, res) =>
	new ProgressController().getExerciseStatusProgress(req, res),
);

router.get("/progress/:id/:idType", (req, res) =>
	new ProgressController().getProgressPercentageById(req, res),
);

export default router;
