import { cacheOrFetch } from "../utils/cache";
import { StackbyEndpoint, StackbyDataResponse } from "../types/types";
import {
  REDIS_STACKBY_KEYS,
  STACKBY_BASE_URL,
  STACKBY_SECRET_KEY,
} from "../utils/constants";
import { PROGRESS_CALCULATION_BY_ENTITY } from "../utils/progressCalculationByEntity";
import { StackbyFilter, StackbyStandardFilter } from "../utils/stackby-filter";

export class StackbyService {
  async fetchStackbyData(
    endpoint: string,
    filter?: StackbyFilter | null
  ): Promise<StackbyDataResponse> {
    const apiKey: string = STACKBY_SECRET_KEY || "";
    const uniqueParam: string = `nocache=${Date.now()}`;
    let url: string = `${STACKBY_BASE_URL}/${endpoint}?${uniqueParam}`;
    let filterKey = "";

    if (filter) {
      url += `&${filter.getStackbyFilterString()}`;
      filterKey +=
        filter instanceof StackbyStandardFilter
          ? `${filter.operator}-${filter.column}-${filter.value}`
          : `${filter.value}`;
    }

    return cacheOrFetch(
      REDIS_STACKBY_KEYS[endpoint as keyof typeof REDIS_STACKBY_KEYS](
        filterKey ? `${filterKey}` : undefined
      ),
      async () => {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Stackby API error: ${text}`);
        }

        return response.json();
      }
    );
  }

  calculateTotalItems(
    id: string,
    endpoint: StackbyEndpoint,
    items: StackbyDataResponse,
    topics?: StackbyDataResponse
  ) {
    if (endpoint === StackbyEndpoint.THEMES) {
      return PROGRESS_CALCULATION_BY_ENTITY[endpoint](
        id,
        items,
        topics as StackbyDataResponse
      );
    }
    return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, items);
  }
}
