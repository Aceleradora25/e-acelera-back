import {PrismaClient} from "@prisma/client"
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export class AllExercisesStatusService {

    async findUserByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } })
            return user
        } catch (error) {
            throw new Error("Error fetching user from database")
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
                    itemId: true
                }
            })

            return infoStatus.map(progress => {
                return {
                    itemId: progress.itemId,
                    itemStatus: progress.itemStatus
                }
            })

        } catch (error) {
            throw new Error("Error fetching user progress from database")
        }
    }
}
