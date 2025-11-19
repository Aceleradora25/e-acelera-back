import { ThemeCategory } from "@prisma/client";
import prisma from "../../../client.js";

export class ThemeService {
  async getAllThemes() {
      return await prisma.theme.findMany({
        orderBy: {
          sequence: 'asc',
        },
      });
  }

  async getThemeById(id: string) {
      return await prisma.theme.findUnique({
        where: { id },
      });
  }

  async getThemesByCategory(category: ThemeCategory) {
      return await prisma.theme.findMany({
        where: { category: ThemeCategory[category] },
        orderBy: {
          sequence: 'asc',
        },
      });
  }
}