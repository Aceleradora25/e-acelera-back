import { ItemStatus } from "@prisma/client";
import { GetProgress, SaveStatusProgress } from "../../types/types";
import prisma from "../../../client"


export class ProgressService {
  calculateProgressPercentage(totalUserItens: number, totalItens: number): { progress: number } {
    return {
      progress: totalUserItens && totalItens ? Math.floor(totalUserItens / totalItens * 100) : 0
    }
  }

  async getProgressPercentageById(
    { userId, id, idType }: GetProgress,
    totalItems: number
  ) {
    try {
      const completedCount = await prisma.progress.count({
        where: {
          userId,
          [idType]: id,
          itemStatus: ItemStatus.Completed
        }
      });

      return this.calculateProgressPercentage(completedCount, totalItems);
    } catch (error) {
      throw new Error("Error fetching user progress from database");
    }
  }

  async getSingleStatusProgressByItemId(itemId: string, userId: number) {
    try {
      return await prisma.progress.findFirst({
      where: {
        userId,
        itemId
      }
    });
    } catch (error) {
      throw new Error("Error fetching user progress from database")
    }
  }

    async getAllStatusProgressById({ id, idType, userId } : GetProgress) {
    try {
      return await prisma.progress.findMany({
      where: {
        userId,
        [idType]: id
      }
    });
    } catch (error) {
      throw new Error("Error fetching user progress from database")
    }
  }

  async saveStatusProgress({ elementType, itemId, itemStatus, themeId, topicId, userId }: SaveStatusProgress) {
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
