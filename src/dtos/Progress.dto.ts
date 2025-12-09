import { IsEnum } from "class-validator";
import { IdType } from "@/types/types.js";

export class ProgressDTO {
	id!: string;

	@IsEnum(IdType, {
		message: "Invalid or missing element idType.",
	})
	idType!: IdType;
}
