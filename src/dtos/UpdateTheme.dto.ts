import { IsOptional, IsString, IsEnum, IsNumber, IsBoolean } from "class-validator";
import { ThemeCategory } from "@prisma/client";

export class UpdateThemeDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsEnum(ThemeCategory)
  category?: ThemeCategory;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
