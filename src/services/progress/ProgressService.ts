import { ItemStatus } from "@prisma/client";
import { GetProgress, SaveStatusProgress, IdType, StackbyDataResponse, DataItem, TopicField, ThemeField } from "../../types/types";
import prisma from "../../../client"


export class ProgressService {
  calculateProgressPercentage(totalUserItens: number, totalItens: number): { progress: number } {
    return {
      progress: totalUserItens && totalItens ? Math.floor(totalUserItens / totalItens * 100) : 0
    }
  }

  private filterTheme(themes: StackbyDataResponse, themeId: string): DataItem | undefined {
    return themes.data.find(theme => theme.id === themeId);
  }

  private filterTopics(topics: StackbyDataResponse, topicIds: string[]): DataItem[] {
    return topics.data.filter(topic => topicIds.includes(topic.id));
  }

  private getTopicTotalItems(topicField: TopicField): number {
    let exerciseCount = 0;
    if (topicField.exercisesInfo && topicField.exercisesInfo !== "Untitle") {
      exerciseCount = topicField.exercisesInfo.split(",").filter(Boolean).length;
    }
    const videoCount = topicField.videoInfo ? 1 : 0;
    return exerciseCount + videoCount;
  }

  private async getTopicCompletedCount(userId: number, topicId: string): Promise<number> {
    return prisma.progress.count({
      where: {
        userId,
        topicId,
        itemStatus: ItemStatus.Completed
      }
    });
  }

  private async calculateTopicProgress(userId: number, topic: DataItem): Promise<{ topicId: string, progress: number, completed: number, total: number }> {
    const topicField = topic.field as TopicField;
    const total = this.getTopicTotalItems(topicField);
    const completed = await this.getTopicCompletedCount(userId, topic.id);
    const progress = total ? Math.floor(completed / total * 100) : 0;
    return { topicId: topic.id, progress, completed, total };
  }

  private async calculateAllTopicsProgress(userId: number, topics: DataItem[]): Promise<{ topicsProgress: { topicId: string, progress: number }[], totalCompleted: number }> {
    const topicsProgress: { topicId: string, progress: number }[] = [];
    let totalCompleted = 0;
    for (const topic of topics) {
      const { topicId, progress, completed } = await this.calculateTopicProgress(userId, topic);
      topicsProgress.push({ topicId, progress });
      totalCompleted += completed;
    }
    return { topicsProgress, totalCompleted };
  }

  private async calculateThemeProgress(
    userId: number,
    topics: DataItem[],
    totalItems: number
  ) {
    const { topicsProgress, totalCompleted } = await this.calculateAllTopicsProgress(userId, topics);
    const progress = totalItems ? Math.floor(totalCompleted / totalItems * 100) : 0;
    return { progress, topics: topicsProgress };
  }

  async getProgressPercentageById(
    { userId, id, idType }: GetProgress,
    totalItems: number,
    themes?: StackbyDataResponse,
    topics?: StackbyDataResponse
  ) {
    try {
      if (idType === IdType.THEME_ID && themes && topics) {
        const theme = this.filterTheme(themes, id);
        if (!theme) return { progress: 0, topics: [] };
        
        const field = theme.field as ThemeField;
        const topicIds = field.topicsInfo ? field.topicsInfo.split(",").filter(Boolean) : [];
        const filteredTopics = this.filterTopics(topics, topicIds);
        
        return await this.calculateThemeProgress(userId, filteredTopics, totalItems);
      } else {
        const completedCount = await prisma.progress.count({
          where: {
            userId,
            [idType]: id,
            itemStatus: ItemStatus.Completed
          }
        });
        return this.calculateProgressPercentage(completedCount, totalItems);
      }
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

  async getAllStatusProgressById({ id, idType, userId }: GetProgress) {
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
      throw new Error("Error saving progress status")
    }
  }
}
