import { IsEnum } from "class-validator";
import { StackbyEndpoint } from "../types/types";

export class StackbyParamsDto {
  @IsEnum(StackbyEndpoint, { message: 'Endpoint must be one of: Exercises, Topics, Themes' })
  endpoint: StackbyEndpoint | undefined;
}