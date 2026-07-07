import { IsNotEmpty, IsString } from "class-validator";

export class GetTopicByIdDTO {
	@IsString()
	@IsNotEmpty({ message: "Topic ID is required" })
	id!: string;
}
