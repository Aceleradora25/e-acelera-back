// src/routes/stackbyDebugRoutes.ts
import { Router } from "express";
import { StackbyDebugController } from "../controllers/stackby/StackbyDebugController";

const router = Router();
const controller = new StackbyDebugController();

router.get("/exercises", controller.listExercisesByTopic);

// GET /debug/stackby/topics
router.get("/topics", controller.listAllTopics);

// rota de teste (exemplo)
router.get("/test-exercises", controller.testAllTopicsExercises);

export default router;
