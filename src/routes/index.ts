import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ExerciseController } from '../controllers/ExerciseController';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.send('Welcome to the homepage');
});

router.get('/user', (req, res) => {
    res.send('User page');
});

router.get('/login', (req, res) => {
    res.send('Login page');
});

router.put('/exercise/:id/status', new ExerciseController().updateExerciseStatus
) 
export default router;
