import { Request, Response } from "express";
import { STATUS_CODE } from "../../utils/constants";
import { ThemeService } from "../../services/theme/ThemeService";
import { ThemeCategory } from "@prisma/client";

export class ThemeController {
  private themeService: ThemeService;

  constructor() {
    this.themeService = new ThemeService();
  }

  async getAllThemes(req: Request, res: Response) {
    try {
      const themes = await this.themeService.getAllThemes();
      return res.status(STATUS_CODE.OK).json(themes);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching themes" });
    }
  }

  async getThemeById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Theme ID is required" });
    }

    try {
      const theme = await this.themeService.getThemeById(id);

      if (!theme) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Theme not found" });
      }

      return res.status(STATUS_CODE.OK).json(theme);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching theme" });
    }
  }

  async getThemesByCategory(req: Request, res: Response) {
    const { category } = req.params;

    if (!category) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: "Category is required" });
    }

    const validCategory = category.toUpperCase() as ThemeCategory;
    if (!Object.values(ThemeCategory).includes(validCategory)) {
        return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: `Invalid category: ${category}. Must be one of ${Object.values(ThemeCategory).join(', ')}` });
    }

    try {
      const themes = await this.themeService.getThemesByCategory(validCategory);
      return res.status(STATUS_CODE.OK).json(themes);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching themes by category" });
    }
  }
}