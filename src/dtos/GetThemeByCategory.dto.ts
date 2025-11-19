import { IsEnum } from "class-validator";
import { ThemeCategory } from "@prisma/client";
import { Type } from "class-transformer";

export class GetThemeByCategoryDTO {
    @IsEnum(ThemeCategory, {
    always: true,
    message: `Category must be one of: ${Object.values(ThemeCategory).join(', ')}`
  })
  category!: ThemeCategory;
}