import { ThemeCategory } from "@prisma/client";
import prisma from "../../../client.js";
import { CreateThemeDTO } from "../../dtos/CreateTheme.dto"
import { UpdateThemeDTO } from "../../dtos/UpdateTheme.dto";
export class ThemeService {
  //async getThemes(category?: ThemeCategory) {
   async getThemes(category?: ThemeCategory, page: number = 1, limit: number = 10) { //Geo
    const where = category ? { category } : {};
     const skip = (page - 1) * limit; //geo
   /* return await prisma.theme.findMany({
      where,
      orderBy: { sequence: "asc" },
    }); */

    const [theme, total] = await Promise.all([prisma.theme.findMany({
      where,
      orderBy: { sequence: "asc"},
      skip: skip,
      take: limit,
    }), //Geo
    prisma.theme.count({ where }) ]) //Geo
    return { data: ThemeService, meta: { total, page, limit, totalPages:Math.ceil(total / limit),}}
    } //Geo

  async getThemeById(id: string) {
    return await prisma.theme.findUnique({
      include: { topic: true },
      where: { id },
    });
  }

  async createTheme(dto: CreateThemeDTO) {
    const theme = await prisma.theme.create({
      data: {
        title: dto.title,
        description: dto.description,
        shortDescription: dto.shortDescription,
        image: dto.image,
        alt: dto.alt,
        category: dto.category,
        sequence: dto.sequence || 0,
        isActive: true,
      },
    });
    return theme;
  }

  async updateTheme(id: string, dto: UpdateThemeDTO) {
  const existingTheme = await prisma.theme.findUnique({
    where: { id },
  });

  if (!existingTheme) {
    throw new Error("Theme not found");
  }

  const theme = await prisma.theme.update({
    where: { id },
    data: {
      ...dto,
    },
  });

  return theme;
}

  async deleteTheme(id: string) {
    const theme = await prisma.theme.update({
      where: { id },
      data: { isActive: false },
    });
    return theme;
  }
}
