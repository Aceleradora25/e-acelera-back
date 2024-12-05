import { ItemStatus, PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';

dotenv.config()

const prisma = new PrismaClient();

export class ExerciseService {

    async findUserByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            return user
        } catch (error) {
            throw new Error("Error fetching user from database");
        }
    }

    async validateStatus(value: string): Promise<boolean>{
        const validateStatus = ["NotStarted", "InProgress", "Completed"];
        return validateStatus.includes(value)
    }

    async findProgress(userId: number, itemId: string){
        return await prisma.progress.findFirst({
            where: { userId, itemId },
        });
    }

    async updatedProgress(userId: number, itemId: string, itemStatus: ItemStatus){
        return await prisma.progress.updateMany({
            where: { userId, itemId },
            data: { itemStatus: itemStatus }
        });
    }
}