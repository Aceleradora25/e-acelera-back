import { type StackbyDataResponse, StackbyEndpoint } from "../types/types.js";
import { cacheOrFetch } from "../utils/cache.js";
import {
	REDIS_STACKBY_KEYS,
	STACKBY_BASE_URL,
	STACKBY_SECRET_KEY,
} from "../utils/constants.js";
import { PROGRESS_CALCULATION_BY_ENTITY } from "../utils/progressCalculationByEntity.js";
import {
	type StackbyFilter,
	StackbyStandardFilter,
} from "../utils/stackby-filter.js";

export class StackbyService {
	async fetchStackbyData(
		endpoint: string,
		filter?: StackbyFilter | null,
	): Promise<StackbyDataResponse> {

		const apiKey: string = STACKBY_SECRET_KEY || "";
		let url: string = `${STACKBY_BASE_URL}/${endpoint}?latest=true`;
		let filterKey = "";

		if (filter) {
			url += `&${filter.getStackbyFilterString()}`;
			filterKey +=
				filter instanceof StackbyStandardFilter
					? `${filter.operator}-${filter.column}-${filter.value}`
					: `${filter.value}`;
		}

		const result = await cacheOrFetch(
			REDIS_STACKBY_KEYS[endpoint as keyof typeof REDIS_STACKBY_KEYS](
				filterKey ? `${filterKey}` : undefined,
			),
			async () => {

				const response = await fetch(url, {
					headers: {
						"Content-Type": "application/json",
						"x-api-key": apiKey,
					},
					method: "GET",
				});

				if (!response.ok) {
					const text = await response.text();
					throw new Error(`Stackby API error: ${text}`);
				}

				const data = await response.json();

				const orderedData = data.data
					.map((t: any) => ({
						...t,
						field: {
							...t.field,
							sequence: Number(t.field.sequence),
						},
					}))
					.sort((a: any, b: any) => a.field.sequence - b.field.sequence);

				return !filter || filter instanceof StackbyStandardFilter
					? { data: orderedData }
					: { data: [orderedData[0]] };
			},
		);

		return result as StackbyDataResponse;
	}

	calculateTotalItems(
		id: string,
		endpoint: StackbyEndpoint,
		items: StackbyDataResponse,
		topics?: StackbyDataResponse,
	) {
		if (endpoint === StackbyEndpoint.THEMES) {
			return PROGRESS_CALCULATION_BY_ENTITY[endpoint](
				id,
				items,
				topics as StackbyDataResponse,
			);
		}

		return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, items);
	}
}