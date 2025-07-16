import { redis } from "../lib/redis";

export async function cacheOrFetch<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl: number = 60 * 60 * 8
) {
  const cached: string | null = await redis.get(key);

  if (cached) {
    return cached;
  }

  try {
    const data = await fetchFunction();
    await redis.set(key, JSON.stringify(data), { ex: ttl });
    return data;
  } catch (error) {
    console.error(`Error fetching data for key ${key}:`, error);
    throw error;
  }
}
