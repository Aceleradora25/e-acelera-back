import { ItemStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

interface TopicProgress {
  topicId: string,
  totalItens: number,
  id: number
}

export class TopicService {
  calculateProgress(totalUserItens: number, totalTopicItens: number) {
    return  {
      progress: totalUserItens && totalTopicItens > 0 ? Math.floor(totalUserItens/totalTopicItens * 100) : 0
    }
  }

  async getTopicProgress ({ id, topicId, totalItens }: TopicProgress) {
    try {
      const userItens = await prisma.progress.findMany({ 
        where: { 
          userId: id, 
          topicId,
          itemStatus: ItemStatus.Completed
        }
      });

      return this.calculateProgress(userItens.length, totalItens);
    } catch (error) {
      throw new Error("Error fetching user from database");
    }
  }  
}