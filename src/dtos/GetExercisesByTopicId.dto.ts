import { IsString } from "class-validator";

export class GetExercisesByTopicIdDTO {
  @IsString()
  topicId!: string;
}