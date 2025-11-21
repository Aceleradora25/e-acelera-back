import { IsNotEmpty, IsString } from "class-validator";

export class GetTopicsByThemeIdDTO {
  @IsString()
  @IsNotEmpty({ message: "Theme ID is required" })
  themeId!: string;
}