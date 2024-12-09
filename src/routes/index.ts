import express from 'express'
import { ExerciseController } from '../controllers/ExerciseController'
import { validateTokenMiddleware } from '../middleware/validateTokenMiddleware'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome to the homepage')
})


router.get('/exercise/:itemId/status', validateTokenMiddleware, (req, res) => new ExerciseController().getExerciseStatus(req, res))

router.put('/exercise/:itemId/status', validateTokenMiddleware, (req, res) => new ExerciseController().updateExerciseStatus(req, res))

export default router
