import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTopicDTO {
	@IsString()
	@IsNotEmpty()
	title!: string;

	@IsString()
	description!: string;

	@IsString()
	shortDescription!: string;

	@IsString()
	references!: string;
	
	@IsString()
	@IsOptional()
	themeId?: string;
}
