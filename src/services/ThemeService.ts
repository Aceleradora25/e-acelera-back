import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ThemeService {
  async getThemeProgress(themeId: string) {
    try {
      const topics = await prisma.topic.findMany({
        where: { themeId },
        select: {
          TopicId: true,
          nameId: true,
        },
      });

      return topics;
    } catch (error) {
      console.error("Error fetching theme progress:", error);
      throw new Error("Error fetching theme progress from database");
    }
  }
}
