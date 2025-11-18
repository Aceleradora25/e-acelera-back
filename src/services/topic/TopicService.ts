import prisma from "../../../client";

export class TopicService {
  async getAllTopics() {
    try {
      return await prisma.topic.findMany({
        include: {
          theme: true,
          exercises: true,
          video: true,
        },
      });
    } catch (error) {
      throw new Error("Error fetching topics from database");
    }
  }

  async getTopicById(id: string) {
    try {
      return await prisma.topic.findUnique({
        where: { id },
        include: {
          theme: true,
          exercises: true,
          video: true,
        },
      });
    } catch (error) {
      throw new Error("Error fetching topic by ID from database");
    }
  }

  async getTopicsByThemeId(themeId: string) {
    try {
      return await prisma.topic.findMany({
        where: { themeId },
        include: {
          exercises: true,
          video: true,
        },
      });
    } catch (error) {
      throw new Error("Error fetching topics by theme ID from database");
    }
  }
}