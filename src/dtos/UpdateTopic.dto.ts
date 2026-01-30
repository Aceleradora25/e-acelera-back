import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTopicDTO {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsString()
	shortDescription?: string;

	@IsOptional()
	@IsString()
	references?: string;

	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@IsString()
	@IsOptional()
	themeId?: string;
}
