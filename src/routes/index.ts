import express from 'express'
import { ExerciseController } from '../controllers/exercise/ExerciseController'
import { validateTokenMiddleware } from '../middleware/validateTokenMiddleware'
import { LoginController } from '../controllers/login/LoginController'
import { TopicController } from '../controllers/topic/TopicController'
import { ThemeController } from '../controllers/theme/ThemeController'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome to the homepage')
})

router.use(validateTokenMiddleware)

router.post('/login', (req, res) => new LoginController().registerUser(req, res))
router.post('/topic/:topicId/item/:itemId', (req, res) => new ExerciseController().saveStatusElement(req, res))
router.put('/topic/:topicId/item/:itemId/status', (req, res) => new ExerciseController().updateExerciseStatus(req, res))

router.get('/topic/:topicId/item', (req, res) => new ExerciseController().getTopicExercisesStatus(req, res))
router.get('/topic/:topicId/item/:itemId', (req, res) => new ExerciseController().getExerciseStatus(req, res))

router.get('/topic/:topicId/progress', (req, res) => new TopicController().getTopicProgress(req, res))
router.get('/theme/:themeId/progress', (req, res) => new ThemeController().getThemeProgress(req, res))

export default router