import { ItemStatus, PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export class ExerciseService {
    async tokenVerify(token: string): Promise<string | null> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
            return decoded.email

        } catch (error: any) {
            throw new Error('Invalid token')
        }
    }

    async findUserByEmail(email: string){
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user) throw new Error("User not found")
        return user
    }

    async validateStatus(value: string): Promise<boolean>{
        const validateStatus = ["NotStarted", "InProgress", "Completed"];
        return validateStatus.includes(value)
    }

    async findProgress(userId: number, exerciseId: string){
        return await prisma.progress.findUnique({
            where: { userId, itemId: exerciseId },
        });
    }

    async updatedProgress(userId: number, exerciseId: string, itemStatus: ItemStatus){
        return await prisma.progress.update({
            where: { userId, itemId: exerciseId },
            data: { itemStatus: itemStatus }
        });
    }
}