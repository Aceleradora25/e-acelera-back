import { ThemeCategory } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";

export class GetThemeByCategoryDTO {
	@IsOptional()
	@IsEnum(ThemeCategory, {
		always: true,
		message: `Category must be one of: ${Object.values(ThemeCategory).join(", ")}`,
	})
	category!: ThemeCategory;
}
