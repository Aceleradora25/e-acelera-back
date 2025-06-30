import { DataItem, StackbyEndpoint } from './../types/types';
import { STACKBY_BASE_URL, STACKBY_SECRET_KEY } from "../utils/constants";
import { PROGRESS_CALCULATION_BY_ENTITY } from '../utils/progressCalculationByEntity';

export class StackbyService {
  async fetchStackbyData(endpoint: string) {
    try {
        const apiKey: string = STACKBY_SECRET_KEY || "";
        const uniqueParam: string = `nocache=${Date.now()}`;
        const url: string = `${STACKBY_BASE_URL}/${endpoint}?${uniqueParam}`;

        const response: Response = await fetch(url, {
            method: "GET",
            headers: {
                "x-api-key": apiKey,
                "Content-Type": "application/json",
            }
        });

        if(!response.ok) {
          return {
            error: "Failed to fetch data from the API. Please try again later."
          }
        }

        return response.json();
    } catch (error) {
        return {
            error: `Internal server error: ${error}`
        };
    }
  }

  async calculateTotalItems(id: string, endpoint: StackbyEndpoint) {
      const { data } = await this.fetchStackbyData(endpoint);
      return PROGRESS_CALCULATION_BY_ENTITY[endpoint](id, data as DataItem[]);
  }
}
