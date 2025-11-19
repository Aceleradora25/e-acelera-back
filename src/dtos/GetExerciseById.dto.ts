import { IsString } from "class-validator";

export class GetExerciseByIdDTO {
  @IsString()
  id!: string;
}