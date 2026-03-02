import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class UpdateExerciseDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sequence?: number;

  @IsOptional()
  @IsString()
  topicId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
