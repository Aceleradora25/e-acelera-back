import express from 'express'
import { validateTokenMiddleware } from '../middleware/validateTokenMiddleware'
import { LoginController } from '../controllers/login/LoginController'
import { ProgressController } from '../controllers/progress/ProgressController'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome to the homepage')
})

router.use(validateTokenMiddleware)

router.post('/login', (req, res) => new LoginController().registerUser(req, res))
router.put('/topic/:topicId/item/:itemId/status', (req, res) => new ProgressController().saveStatusProgress(req, res))

router.get('/topic/:topicId/item', (req, res) => new ProgressController().getTopicExercisesStatus(req, res))
router.get('/topic/:topicId/item/:itemId', (req, res) => new ProgressController().getExerciseStatus(req, res))

router.get('/topic/:topicId/progress', (req, res) => new ProgressController().getTopicProgress(req, res))


export default router