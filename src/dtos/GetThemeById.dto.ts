import { IsString, IsNotEmpty } from "class-validator";

export class GetThemeByIdDTO {
  @IsString()
  @IsNotEmpty({ message: "Theme ID is required" })
  id!: string;
}