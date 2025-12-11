import { StackbyEndpoint } from "../types/types.js";
import { cacheOrFetch } from "../utils/cache.js";
import { REDIS_STACKBY_KEYS, STACKBY_BASE_URL, STACKBY_SECRET_KEY, } from "../utils/constants.js";
import { PROGRESS_CALCULATION_BY_ENTITY } from "../utils/progressCalculationByEntity.js";
import { StackbyStandardFilter, } from "../utils/stackby-filter.js";
export class StackbyService {
    async fetchStackbyData(endpoint, filter) {
        const apiKey = STACKBY_SECRET_KEY || "";
        const uniqueParam = `nocache=${Date.now()}`;
        let url = `${STACKBY_BASE_URL}/${endpoint}?${uniqueParam}`;
        let filterKey = "";
        if (filter) {
            url += `&${filter.getStackbyFilterString()}`;
            filterKey +=
                filter instanceof StackbyStandardFilter
                    ? `${filter.operator}-${filter.column}-${filter.value}`
                    : `${filter.value}`;
        }
        return await cacheOrFetch(REDIS_STACKBY_KEYS[endpoint](filterKey ? `${filterKey}` : undefined), async () => {
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
            return !filter || filter instanceof StackbyStandardFilter
                ? data
                : { data: data.data[0] };
        });
    }
    calculateTotalItems(id, endpoint, items, topics) {
        if (endpoint === StackbyEndpoint.THEMES) {
            return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, items, topics);
        }
        return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, items);
    }
}
