import { STACKBY_BASE_URL, STACKBY_SECRET_KEY } from "../utils/constants";

export class StackByService {
  async fetchStackByData(endpoint: string) {
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
}