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

    async updatedProgress(userId: number, itemId: string, itemStatus: ItemStatus) {
        await prisma.progress.updateMany({
            where: { userId, itemId },
            data: { itemStatus },
        });
    
        return await this.findProgress(userId, itemId)
    }
    
    async getStatus(userId: number, topicId: string) {
        try {
            const infoStatus = await prisma.progress.findMany({
                where: {
                    userId,
                    topicId
                },
                select: {
                    itemStatus: true,
                    itemId: true,
                    elementType: true
                }
            })

            return infoStatus.map(progress => {
                return {
                    itemId: progress.itemId,
                    itemStatus: progress.itemStatus,
                    elementType: progress.elementType
                }
            })

        } catch (error) {
            throw new Error("Error fetching user progress from database")
        }
    }
}