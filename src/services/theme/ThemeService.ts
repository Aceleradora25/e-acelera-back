import { ThemeCategory } from "@prisma/client";
import prisma from "../../../client";

export class ThemeService {
  async getAllThemes() {
    try {
      return await prisma.Theme.findMany({
        orderBy: {
          sequence: 'asc',
        },
      });
    } catch (error) {
      throw new Error("Error fetching themes from database");
    }
  }

  async getThemeById(id: string) {
    try {
      return await prisma.Theme.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error("Error fetching theme by ID from database");
    }
  }

  async getThemesByCategory(category: ThemeCategory) {
    try {
      return await prisma.Theme.findMany({
        where: { category },
        orderBy: {
          sequence: 'asc',
        },
      });
    } catch (error) {
      throw new Error("Error fetching themes by category from database");
    }
  }

}