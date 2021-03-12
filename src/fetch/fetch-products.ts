import fetch from "node-fetch";
import fetchManufacturerAvailability from "./fetch-availability";
import insertProduct from "../db/insert-product";
import deleteProduct from "../db/delete-product";
import { getResult, getClient } from "../shared/redis-client";
import { RedisClient } from "redis";
import { QueryResult } from "pg";
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

        // Test if an ID exists in the product's DB, insert else check for update
        insertProduct(product, item, colors);
      });

      // Get availability data
      const listString: string =
        NODE_ENV === "test" ? "manufacturer-list_test" : "manufacturer-list";

      const cache: number =
        NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;

      const array: string[] = [];
      const manufacturersFetched: StringList = { [listString]: array };

      for (const manufacturer of manufacturers) {
        if (!manufacturersFetched[listString].includes(manufacturer)) {
          console.log(
            "Calling to fetch",
            manufacturersFetched[listString],
            "does not include",
            manufacturer
          );
          fetchManufacturerAvailability(manufacturer, product);
          manufacturersFetched[listString].push(manufacturer);

          // Save manufacturer list to Redis
          if (manufacturersFetched[listString].length === manufacturers.length) {
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
      }
    } else if (await !Array.isArray(data)) {
      // Make the request again
      console.log(`failed to fetch ${product} try again!`);
      fetchProductData(product);
    }
  } catch (err) {
    fetchProductData(product);
  }
};

export default fetchProductData;
