import fetch from "node-fetch";
import { RedisClient } from "redis";
import fetchManufacturerAvailability from "./fetch-availability";
import insertProduct from "../db/insert-product";
import deleteProduct from "../db/delete-product";
import { getResult, getClient } from "../shared/redis-client";
import processColors from "../shared/process-colors";
import {
  PRODUCT_URL,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV,
} from "../shared/constants";
import { StringList, ProductItemRaw } from "../types";

const fetchProductData = async (product: string): Promise<void> => {
  const client: RedisClient = await getClient();
  const productIDs: string[] = [];
  const manufacturers: string[] = [];

  const url = `${PRODUCT_URL}${product}`;
  let data: ProductItemRaw[];
  try {
    // Try to get the data
    const response = await fetch(url);
    data = await response.json();

    if ((await Array.isArray(data)) && data.length) {
      // Delete records missing from Product API response
      deleteProduct(product, productIDs);

      await data.forEach((item, index) => {
        // Need to limit size of DB rows to < 10,000
        if (index < 3333) {
          // Build manufacturers array for this product
          if (!manufacturers.includes(item.manufacturer)) {
            const manValue: string = (NODE_ENV === "test")
              ? `${item.manufacturer}_test`
              : item.manufacturer;
            manufacturers.push(manValue);
          }

          // Build an array of product IDs
          productIDs.push(item.id);

          // Process colors
          const colors: string = processColors(item.color);

          // Test if an ID exists in the product's DB, insert else check for update
          insertProduct(product, item, colors);
        }
      });

      // Get availability data
      const listString: string = (NODE_ENV === "test")
        ? "manufacturer-list_test"
        : "manufacturer-list";

      const cache: number = (NODE_ENV === "test")
        ? TEST_CACHE_TIMER
        : CACHE_TIMER;

      // Check for Redis manufacturer list
      const result: string | null = await getResult(listString);
      const manRedis: StringList | undefined = result
        ? JSON.parse(result)
        : undefined;

      // Create an object to track manufacturer data fetched
      const array: string[] = [];
      const manufacturersFetched: StringList = { [listString]: array };

      if (manRedis) {
        // Some data has already been fetched by a preceding product fetch
        manufacturersFetched[listString] = [...manRedis[listString]];
      }

      manufacturers.forEach((manufacturer) => {
        // For each manufacturer found in this product's data
        if (!manufacturersFetched[listString].includes(manufacturer)) {
          // If that manufacturer has not previously been fetched
          console.log(
            "Calling to fetch",
            manufacturersFetched[listString],
            "does not include",
            manufacturer,
          );
          // Fetch data for that manufacturer
          fetchManufacturerAvailability(manufacturer, product);
          // Then add it to the list of manufacturer's data fetched
          manufacturersFetched[listString].push(manufacturer);
        }

        // Once all manufacturers of this product have been fetched, set list to Redis
        if (manufacturersFetched[listString].length === manufacturers.length) {
          client.set(
            listString,
            JSON.stringify({
              [listString]: manufacturersFetched[listString],
            }),
            "EX",
            cache,
          );
        }
      });
    } else if (await !Array.isArray(data)) {
      // Make the request again
      console.log(`failed to fetch ${product} try again!`);
      fetchProductData(product);
    }
  } catch (err) {
    // Product JSON data malformed, request again
    fetchProductData(product);
  }
};

export default fetchProductData;
