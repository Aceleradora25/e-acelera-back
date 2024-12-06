import express from 'express';
import { ExerciseController } from '../controllers/ExerciseController';
import { validateTokenMiddleware } from '../middleware/validateTokenMiddleware';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Welcome to the homepage');
});
//Rota antiga para teste//
router.put('/exercise/:itemId/status', new ExerciseController().updateExerciseStatus);
//Rota Nova//
router.put('/topic/:idTopic/item/:idItem', validateTokenMiddleware, (req, res) => new ExerciseController().updateExerciseStatus(req, res));
 
export default router;


