import prisma from "../../../client.js";

export class TopicService {
  async getAllTopics() {
      return await prisma.topic.findMany({
        include: {
          theme: true,
          exercises: true,
          video: true,
        },
      });
  }

  async getTopicById(id: string) {
      return await prisma.topic.findUnique({
        where: { id },
        include: {
          theme: true,
          exercises: true,
          video: true,
        },
      });
  }

  async getTopicsByThemeId(themeId: string) {
      return await prisma.topic.findMany({
        where: { themeId },
        include: {
          exercises: true,
          video: true,
        },
      });
  }
}