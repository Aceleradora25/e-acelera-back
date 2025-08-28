import { IsEnum, IsString, IsOptional } from "class-validator";
import { StackbyEndpoint } from "../types/types";
export class StackbyParamsDto {
  @IsEnum(StackbyEndpoint, {
    message: "Endpoint must be one of: Exercises, Topics, Themes",
  })
  endpoint: StackbyEndpoint | undefined;

  @IsString()
  @IsOptional()
  filterName?: string;

  @IsString()
  @IsOptional()
  field?: string;

  @IsString()
  @IsOptional()
  filterValue?: string;

}
