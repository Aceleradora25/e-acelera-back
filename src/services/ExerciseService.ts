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

    async findProgress(userId: number, itemId: string, topicId: string) {
        try {
            const count = await prisma.progress.count({
                where: { userId, itemId, topicId },
            });

            if (count > 1) {
                throw new Error("Multiple progress records found. Expected only one.");
            }

            const response = await prisma.progress.findFirst({
                where: { userId, itemId, topicId },
            });

            if (!response) {
                throw new Error(`Progress record not found for user ${userId} and item ${itemId}, ${topicId}.`);
            }

            if (!this.validateStatus(response.itemStatus)) {
                throw new Error("Invalid status in the progress record.");
            }

            return response;
        } catch (error: any) {
            console.error(`Error fetching progress: ${error.message}`);
            throw new Error(`Failed to fetch progress: ${error.message}`);
        }
    }
    async updatedProgress(userId: number, itemId: string, itemStatus: ItemStatus, topicId: string) {
    
        const isStatusValid = await this.validateStatus(itemStatus);
        if (!isStatusValid) {
            throw new Error("Invalid item status provided.");
        }

        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw new Error("User does not exist.");
        }

        const existingProgress = await prisma.progress.findFirst({
            where: { userId, itemId, topicId },
        });

        if (!existingProgress) {
            throw new Error("No progress record found for this user and item.");
        }

        if (existingProgress.itemStatus === itemStatus) {
            throw new Error("The progress status is already the same.");
        }

        try {
            const updatedProgress = await prisma.progress.updateMany({
                where: { userId, itemId, topicId },
                data: { itemStatus },
            });

            if (updatedProgress.count === 0) {
                throw new Error("Failed to update progress.");
            }

            return updatedProgress;  
        } catch (error) {
            throw new Error("An error occurred while updating progress.");
        }
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
