import { IsEnum, IsOptional } from "class-validator";
import { ThemeType } from "../types/types";

export class GetThemesDTO {
  @IsOptional()
  @IsEnum(ThemeType, {
    message: "Invalid type parameter. Must be 'nivelamento' or 'autoestudo'."
  })             
  themeType?: ThemeType;
}
