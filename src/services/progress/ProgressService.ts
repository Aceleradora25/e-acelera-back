import { ItemStatus } from "@prisma/client";
import { GetTopicProgress, Progress } from "../../types/types";
import prisma from "../../../client"


export class ProgressService {
  calculateProgress(totalUserItens: number, totalTopicItens: number): { progress: number } {
    return {
      progress: totalUserItens && totalTopicItens ? Math.floor(totalUserItens / totalTopicItens * 100) : 0
    }
  }

  async getAllProgressByTopic(userId: number, topicId: string) {
    try {
      return await prisma.progress.findMany({
        where: {
          userId,
          topicId
        }
      })
    } catch (error) {
      throw new Error("Error fetching user progress from database")
    }
  }

  async getTopicProgress({ userId, topicId, totalItens }: GetTopicProgress) {
    try {
      const userItens = await prisma.progress.findMany({
        where: {
          userId,
          topicId,
          itemStatus: ItemStatus.Completed
        }
      });

      return this.calculateProgress(userItens.length, totalItens);
    } catch (error) {
      throw new Error("Error fetching user progress from database");
    }
  }

  async getProgressByExerciseId(userId: number, itemId: string) {
    try {
      return await prisma.progress.findFirstOrThrow({
        where: {
          userId,
          itemId
        }
      })
    } catch (error) {
      throw new Error("Error fetching user progress from database")
    }
  }

  async saveStatusProgress({ elementType, itemId, itemStatus, themeId, topicId, userId }: Progress) {
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
    } catch (error) {
      console.log(error);
      throw new Error("Error saving progress status")
    }
  }

}