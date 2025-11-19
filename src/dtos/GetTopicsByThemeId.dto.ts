import { IsString } from "class-validator";

export class GetTopicsByThemeIdDTO {
  @IsString()
  themeId!: string;
}