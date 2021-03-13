import { Request, Response } from "express";
import format from "pg-format";
import { RedisClient } from "redis";
import { QueryResult } from "pg";
import query from "../db/query";
import {
  PRODUCT_LIST,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV,
} from "../shared/constants";
import { getResult, getClient } from "../shared/redis-client";
import { ProductRedisHash } from "../types";

const getProductItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const client: RedisClient = await getClient();
  try {
    const productReq: string = req.header("X-PRODUCT") ?? "";

    let product: string | undefined = PRODUCT_LIST.includes(productReq)
      ? productReq
      : undefined;

    if (!product) {
      // API request for nonexistent product
      res
        .status(404)
        .send(`The requested product ${productReq} does not exist.`);
    } else if (product) {
      // API request for known product. Get product's stored hash if available
      const result: string | null = NODE_ENV === "test"
        ? await getResult(`${product}_test`)
        : await getResult(product);
      const productData: ProductRedisHash | undefined = result
        ? JSON.parse(result)
        : undefined;

      let resValue: Record<string, never> | ProductRedisHash = {};

      if (!productData) {
        // If no stored hash, get it from the DB
        const id = "id";
        const queryString: string = format(
          "SELECT * FROM %I ORDER BY %I",
          product,
          id,
        );

        const productQuery: QueryResult = await query(queryString);

        resValue[product] = productQuery.rows;

        // Handle different cache timers
        const cache: number = NODE_ENV === "test"
          ? TEST_CACHE_TIMER
          : CACHE_TIMER;

        // Add _test to product
        if (NODE_ENV === "test") product = `${product}_test`;

        // Save object to redis as a hash
        client.set(product, JSON.stringify(resValue), "EX", cache);
      } else if (NODE_ENV === "test") {
        // Change response key for testing
        resValue = Object.keys(productData).reduce((acc, curr) => {
          acc[`${curr}_test`] = productData[curr];
          return acc;
        }, {});
      } else {
        // Dev & Prod response value
        resValue = productData;
      }
      // API response as JSON
      res.json(resValue);
    }
  } catch (err) {
    console.log("getProduct failed!", err);
    res
      .status(404)
      .send("The requested product data could not be found.");
  }
};

export default getProductItems;
