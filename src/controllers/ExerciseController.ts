import { Prisma, PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

export class ExerciseController {
    async updateExerciseStatus (req: Request, res: Response) {
        const prisma = new PrismaClient();
        const { id } = req.params;
        const { value } = req.body;
        try {
            const exercise = await prisma.progress.update({where: {itemId : id}, data: { itemStatus: value}});
            res.status(200).json({message: exercise})

        } catch (error) {
            res.json({message: "Erro"})
        }
    }
}