import { IsNotEmpty, IsString } from "class-validator";

export class GetExercisesByTopicIdDTO {
  @IsString()
  @IsNotEmpty({ message: "Topic ID is required" })
  topicId!: string;
}