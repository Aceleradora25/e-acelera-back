import express from 'express';
import { ExerciseController } from '../controllers/ExerciseController';
import { validateTokenMiddleware } from '../middleware/validateTokenMiddleware';
import { AllExercisesController } from '../controllers/AllExercisesController';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the homepage');
});

router.put('/exercise/:itemId/status', validateTokenMiddleware, (req, res) => new ExerciseController().updateExerciseStatus(req, res));
router.get('/:topicId/status', validateTokenMiddleware, (req, res) => new AllExercisesController().getAllStatus(req, res));
export default router;
