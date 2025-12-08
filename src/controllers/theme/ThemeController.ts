import { Request, Response } from "express";
import { STATUS_CODE } from "../../utils/constants";
import { ThemeService } from "../../services/theme/ThemeService";
import { plainToInstance } from "class-transformer";
import { GetThemeByCategoryDTO } from "../../dtos/GetThemeByCategory.dto.js";
import { validateOrReject, ValidationError } from "class-validator";
import { GetThemeByIdDTO } from "../../dtos/GetThemeById.dto.js";

export class ThemeController {
  private themeService: ThemeService;

  constructor() {
    this.themeService = new ThemeService();
  }

  async getThemes(req: Request, res: Response) {
  const dto = plainToInstance(GetThemeByCategoryDTO, req.query, { enableImplicitConversion: true },
);
    try {
      await validateOrReject(dto);
      const themes = await this.themeService.getThemes(dto.category);
      return res.status(STATUS_CODE.OK).json(themes);
    } catch (error) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching themes" });
    }
  }

  async getThemeById(req: Request, res: Response) {
    const dto = plainToInstance(GetThemeByIdDTO, req.params, { enableImplicitConversion: true });

    try {
      await validateOrReject(dto);
      const theme = await this.themeService.getThemeById(dto.id);

      if (!theme) {
        return res
          .status(STATUS_CODE.NOT_FOUND)
          .json({ message: "Theme not found" });
      }

      return res.status(STATUS_CODE.OK).json(theme);
    } catch (error) {
      if (Array.isArray(error) && error.every((err) => err instanceof ValidationError)) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: error[0].constraints?.isNotEmpty || "Invalid Theme ID" });
    }

        return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching theme", details: error });
    }
  }
}