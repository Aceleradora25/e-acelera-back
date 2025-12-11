import { ThemeCategory } from "@prisma/client";
import prisma from "../../../client.js";
export class ThemeService {
    async getThemes(category) {
        if (category) {
            return await prisma.theme.findMany({
                orderBy: {
                    sequence: "asc",
                },
                where: { category: ThemeCategory[category] },
            });
        }
        return await prisma.theme.findMany({
            orderBy: {
                sequence: "asc",
            },
        });
    }
    async getThemeById(id) {
        return await prisma.theme.findUnique({
            include: {
                topic: true,
            },
            where: { id },
        });
    }
}
