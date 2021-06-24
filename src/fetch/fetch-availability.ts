import fetch from "node-fetch";
import { RedisClient } from "redis";
import { getResult, getClient } from "../shared/redis-client";
import {
  MANUFACTURER_URL,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV,
} from "../shared/constants";
import { ManRedisHash, ManAPIRes } from "../types";

// Get Manufacturer Availability
const fetchManufacturerAvailability = async (
  manufacturer: string,
  product: string,
): Promise<void> => {
  // Check if Redis has data for the manufacturer
  const client: RedisClient = await getClient();
  const result: string | null = await getResult(manufacturer);

  const manufacturerData: ManAPIRes[] | undefined = result
    ? JSON.parse(result)
    : undefined;
  const resValue: Record<string, never> | ManRedisHash = {};
  if (!manufacturerData) {
    // No manufacturer data in hash, fetch it
    console.log("Fetching data for", product, manufacturer);
    const url = `${MANUFACTURER_URL}${manufacturer}`;
    let data: ManAPIRes;

    try {
      // Try to get the data
      const response = await fetch(url);
      data = await response.json();

      if ((await Array.isArray(data.response)) && data.response.length) {
        console.log(`${manufacturer} data is valid`);
        // Save object to Redis as a hash
        resValue[manufacturer] = data.response;
        const cache: number = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;

        client.set(manufacturer, JSON.stringify(resValue), "EX", cache);
      } else if (await !Array.isArray(data.response)) {
        // Response is not an array, try again
        console.log(`Failed, retrying for ${manufacturer}, ${product}!`);
        fetchManufacturerAvailability(manufacturer, product);
      }
    } catch (err) {
      // Bad JSON, an error was thrown, try again
      console.log(`Retrying for ${manufacturer} - ${product}`, err);
      fetchManufacturerAvailability(manufacturer, product);
    }
  }
};

export default fetchManufacturerAvailability;
