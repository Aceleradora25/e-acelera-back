import { redis } from "../lib/redis";
import { CACHE_TTL, IS_CACHE_ENABLED } from "./constants";

export async function cacheOrFetch<T>(
  key: string,
  fetchFunction: () => Promise<T>
) {
  try {
    if (!IS_CACHE_ENABLED) {
      return await fetchFunction();
    }

    const cached: string | null = await redis!.get(key);

    if (cached) {
      return cached;
    }

    const data = await fetchFunction();
    await redis!.set(key, JSON.stringify(data), { ex: CACHE_TTL });
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${key}:`, error);
    throw error;
  }
}
