import { IsEnum, IsOptional } from "class-validator";
import { ThemeCategory } from "@prisma/client";

export class GetThemeByCategoryDTO {
    @IsOptional()
    @IsEnum(ThemeCategory, {
    always: true,
    message: `Category must be one of: ${Object.values(ThemeCategory).join(', ')}`
  })
  category!: ThemeCategory;
}