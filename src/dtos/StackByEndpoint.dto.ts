import { IsEnum } from "class-validator";
import { StackByEndpoint } from "../types/types";

export class StackByParamsDto {
  @IsEnum(StackByEndpoint, { message: 'Endpoint must be one of: Exercises, Topics, Themes' })
  endpoint: StackByEndpoint | undefined;
}