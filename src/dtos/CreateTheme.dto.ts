import { ThemeCategory } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt } from "class-validator";

export class CreateThemeDTO {
	@IsString()
	@IsNotEmpty()
	title!: string;

	@IsString()
	description!: string;

	@IsString()
	shortDescription!: string;

	@IsString()
	image!: string;

	@IsString()
	alt!: string;

	@IsEnum(ThemeCategory)
	category!: ThemeCategory;

	@IsOptional()
	@IsInt()
	sequence?: number;
}
