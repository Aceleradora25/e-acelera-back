import { IsEnum, IsString, IsOptional } from "class-validator";
import { StackbyEndpoint } from "../types/types";
import { STACKBY_FILTER_OPERATORS } from "../utils/stackby-filter";
export class StackbyParamsDto {
  @IsEnum(StackbyEndpoint, {
    message: "Endpoint must be one of: Exercises, Topics, Themes",
  })
  endpoint: StackbyEndpoint | undefined;

  @IsOptional()
  @IsEnum(STACKBY_FILTER_OPERATORS)
  operator?: STACKBY_FILTER_OPERATORS;

  @IsOptional()
  @IsString()
  column?: string;

  @IsOptional()
  value?: string | number;
}
