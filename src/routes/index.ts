import express from 'express'
import { ExerciseController } from '../controllers/exercise/ExerciseController'
import { validateTokenMiddleware } from '../middleware/validateTokenMiddleware'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome to the homepage')
})

router.get('/login', validateTokenMiddleware, (req, res) => new ExerciseController().updateExerciseStatus(req, res))

router.put('/topic/:topicId/item/:itemId/status', validateTokenMiddleware, (req, res) => new ExerciseController().updateExerciseStatus(req, res))

router.get('/topic/:topicId/item', validateTokenMiddleware, (req, res) => new ExerciseController().getTopicExercisesStatus(req, res))
router.get('/topic/:topicId/item/:itemId', validateTokenMiddleware, (req, res) => new ExerciseController().getExerciseStatus(req, res))

export default router