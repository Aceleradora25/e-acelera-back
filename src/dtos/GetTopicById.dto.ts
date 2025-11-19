import { IsString } from "class-validator";

export class GetTopicByIdDTO {
  @IsString()
  id!: string;
}