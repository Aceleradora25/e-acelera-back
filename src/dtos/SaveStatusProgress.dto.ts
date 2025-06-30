import { ElementType, ItemStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class SaveStatusProgressDTO {
  themeId!: string;

  @IsEnum(ElementType, {
    message: "Invalid or missing element type."
  })
  elementType!: ElementType;

  @IsEnum(ItemStatus, {
    message: "Invalid or missing status value."
  })
  itemStatus!: ItemStatus;
}
