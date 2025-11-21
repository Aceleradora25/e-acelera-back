import { IsNotEmpty, IsString } from "class-validator";

export class GetExerciseByIdDTO {
  @IsString()
  @IsNotEmpty({ message: "Exercise ID is required" })
  id!: string;
}