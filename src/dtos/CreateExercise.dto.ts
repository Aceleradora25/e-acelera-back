import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateExerciseDTO {
  @IsString()
  @IsNotEmpty({ message: "Title is required" })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: "Short description is required" })
  shortDescription!: string;

  @IsString()
  @IsNotEmpty({ message: "Description is required" })
  description!: string;

  @IsOptional()
  @IsInt()
  sequence?: number;

  @IsOptional()
  @IsString()
  topicId?: string;
}
