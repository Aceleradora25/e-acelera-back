import type { StackbyParamsDto } from "@/dtos/StackbyEndpoint.dto.js";
import {
	MissingColumnError,
	MissingValueError,
} from "@/errors/StackbyErrors.js";
import {
	STACKBY_FILTER_OPERATORS,
	StackbyFilterById,
	StackbyStandardFilter,
} from "@/utils/stackby-filter.js";

export function buildStackbyFilter(dto: StackbyParamsDto) {
	if (!dto.operator) {
		return null;
	}

	if (dto.operator === STACKBY_FILTER_OPERATORS.BY_ID) {
		if (!dto.value) {
			throw new MissingValueError(dto.operator);
		}
		return new StackbyFilterById(dto.value as string);
	}

	if (!dto.column) {
		throw new MissingColumnError(dto.operator);
	}

	return new StackbyStandardFilter(dto.operator, dto.column, dto.value);
}
