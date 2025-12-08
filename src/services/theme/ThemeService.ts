import { ThemeCategory } from "@prisma/client";
import prisma from "../../../client.js";

export class ThemeService {
  async getThemes(category?: ThemeCategory) {
     
    if(category) {
      return await prisma.theme.findMany({
        where: { category: ThemeCategory[category] },
        orderBy: {
          sequence: 'asc',
        },
      });
    }
    
    return await prisma.theme.findMany({
        orderBy: {
          sequence: 'asc',
        },
      });
  }

  async getThemeById(id: string) {
      return await prisma.theme.findUnique({
        where: { id },
        include: {
          topic: true,
        },
      });
  }
}