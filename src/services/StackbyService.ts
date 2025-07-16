import { cacheOrFetch } from "../utils/cache";
import { StackbyEndpoint } from "../types/types";
import {
  REDIS_STACKBY_KEYS,
  STACKBY_BASE_URL,
  STACKBY_SECRET_KEY,
} from "../utils/constants";
import { PROGRESS_CALCULATION_BY_ENTITY } from "../utils/progressCalculationByEntity";

export class StackbyService {
  async fetchStackbyData(endpoint: string) {
    const apiKey: string = STACKBY_SECRET_KEY || "";
    const uniqueParam: string = `nocache=${Date.now()}`;
    const url: string = `${STACKBY_BASE_URL}/${endpoint}?${uniqueParam}`;

    return cacheOrFetch(
      REDIS_STACKBY_KEYS[endpoint as keyof typeof REDIS_STACKBY_KEYS],
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
      },
      60 * 60 * 24
    );
  }

  async calculateTotalItems(id: string, endpoint: StackbyEndpoint) {
    const items = await this.fetchStackbyData(endpoint);
    if (endpoint === StackbyEndpoint.THEMES) {
      const topics = await this.fetchStackbyData(StackbyEndpoint.TOPICS);
      return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, items, topics);
    }
    return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, items);
  }
}
