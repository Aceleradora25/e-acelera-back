import { ElementType, ItemStatus, PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

dotenv.config()

const prisma = new PrismaClient()

interface TopicProgress {
    itemId: string, 
    elementType: ElementType, 
    userId: number, 
    itemStatus: ItemStatus, 
    topicId: string, 
    themeId: string
}


export class ExerciseService {
    async findUserByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } })
            return user
        } catch (error) {
            throw new Error("Error fetching user from database")
        }
    }

    validateStatus(value: string): boolean {
        const validateStatus = ["NotStarted", "InProgress", "Completed"]
        return validateStatus.includes(value)
    }

    validateElementType(value: string): boolean {
        const validateStatus = ["Exercise", "Video"]
        return validateStatus.includes(value)
    }

    formatDateTime(): Date {
        const offset = -3 * 60 * 60 * 1000
        return new Date(Date.now() + offset)
    }

    async findProgress({ itemId, themeId, topicId, userId, elementType } : Omit<TopicProgress, 'itemStatus'>) {
        try {
            const count = await prisma.progress.count({
                where: { userId, itemId, topicId },
            })

            if (count > 1) {
                throw new Error("Multiple progress records found. Expected only one.")
            }

            const progress = await prisma.progress.findFirst({
                where: {
                    userId,
                    itemId
                },
            })

            if (!progress) {
                await prisma.progress.create({
                    data: {
                        itemId,
                        userId,
                        themeId,
                        elementType,
                        topicId,
                        itemStatus: ItemStatus.NotStarted,
                        modifiedAt: new Date(),
                    }
                })
            }

            return progress
        } catch (error: any) {
            console.error(`Error fetching progress: ${error.message}`)
            throw new Error(`Failed to fetch progress: ${error.message}`)
        }
    }

    async updatedProgress(userId: number, itemId: string, itemStatus: ItemStatus, topicId: string) {
        try {
            const updatedProgress = await prisma.progress.updateMany({
                where: { userId, itemId, topicId },
                data: { itemStatus },
            })

            if (updatedProgress.count === 0) {
                throw new Error("Failed to update progress.")
            }
            const updatedRecords = await prisma.progress.findMany({
                where: { userId, itemId, topicId },
                select: {
                    id: true,
                    userId: true,
                    elementType: true,
                    itemId: true,
                    itemStatus: true,
                },
            })

            return updatedRecords

        } catch (error) {
            throw new Error("An error occurred while updating progress.")
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

    async exerciseStatus(userId: number, itemId: string, topicId: string) {
        try {
            return await prisma.progress.findMany({
                where: { userId, itemId, topicId },
                select: { itemStatus: true, itemId: true }
            })

        } catch (error) {
            throw new Error("Error fetching status progress from database")
        }
    }

    async findTopicById(topicId: string) {
        try {
            return await prisma.progress.findFirstOrThrow({ where: { topicId } })

        } catch (error) {
            throw new Error("Error fetching topicId progress from database")
        }
    }

    async findItemById(itemId: string){
        try{
            return await prisma.progress.findMany({where: { itemId } })
        } catch(error){
            throw new Error("Error fetching itemId progress from database")
        }
    }
    
    async saveStatus({ elementType, itemId, itemStatus, themeId, topicId, userId }: TopicProgress) {
        try {
            const createdProgress = await prisma.progress.upsert({
                where: { 
                    itemId_userId: {
                        itemId,
                        userId
                    },
                },
                update: { itemStatus },
                create: {
                    itemId,
                    elementType,
                    userId,
                    itemStatus,
                    topicId,
                    themeId,
                }
            })

            return createdProgress
        } catch(error){
            throw new Error("Error saving progress status")
        }
    }
}
