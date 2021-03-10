import fetch from "node-fetch";
import fetchAvailability from "./fetch-availability";
import insertProduct from "../db/insert-product";
import deleteProduct from "../db/delete-product";
import { getResult, getClient } from"../shared/redis-client";
import { RedisClient } from "redis";
import processColors from "../shared/process-colors";
import { QueryResult } from 'pg';
import {
  PRODUCT_URL,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV,
} from "../shared/constants.js";

const client: RedisClient = getClient();

const fetchProductData = async (product: string): Promise<QueryResult> => {
  const productIDs: Array<string> = [];
  const manufacturers: Array<string> = [];

  const url = `${PRODUCT_URL}${product}`; // Build URL
  let data;
  try {
    // Try to get the data
    const response = await fetch(url);
    data = await response.json();

    if ((await Array.isArray(data)) && data.length) {
      // If response is an array and has length

      // Keep DB in sync with latest API call by deleting records
      deleteProduct(product, productIDs);

      await data.forEach((item) => {
        // Build manufacturers array
        if (!manufacturers.includes(item.manufacturer))
          NODE_ENV === "test"
            ? manufacturers.push(`${item.manufacturer}_test`)
            : manufacturers.push(item.manufacturer);

        // Build an array of product IDs
        productIDs.push(item.id);

        // Process colors
        const colors: string = processColors(item.color);

        // Test if an ID exists in the product's DB, insert else update
        insertProduct(product, item, colors);
      });

      // Get availability data
      const listString: string =
        NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";

      const cache: number = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;
      const result: string | null = await getResult(listString);
      let manufacturersFetched: StringList | undefined = (result) ? JSON.parse(result) : undefined;

      for (const manufacturer of manufacturers) {
        if (!manufacturersFetched) {
          manufacturersFetched = {
            [listString]: [],
          };
          console.log("init", manufacturersFetched);
        }
        if (!manufacturersFetched[listString].includes(manufacturer)) {
          // IF not in Redis, fetch it
          console.log(
            "Calling to fetch",
            manufacturersFetched[listString],
            "does not include",
            manufacturer
          );
          fetchAvailability(manufacturer, product);

          // Save manufacturer to Redis
          manufacturersFetched[listString].push(manufacturer);
          client.set(
            listString,
            JSON.stringify({
              [listString]: manufacturersFetched[listString],
            }),
            "EX",
            cache
          );
        }
      }
    } else if (await !Array.isArray(data.response)) {
      // Make the request again
      console.log(`failed to fetch ${product} try again!`);
      fetchProductData(product);
    }
  } catch (err) {
    fetchProductData(product);
  }
};

export default fetchProductData;
