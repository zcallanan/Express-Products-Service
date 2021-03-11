import query from "../db/query";
import format from "pg-format";
import { express } from "../index";
import {
  PRODUCT_LIST,
  CACHE_TIMER,
  TEST_CACHE_TIMER,
  NODE_ENV
} from "../shared/constants";
import {
  getResult,
  getClient,
} from "../shared/redis-client";
import { RedisClient } from "redis";
import { QueryResult } from 'pg';
import { ProductItemObject } from "../types";

const getProductItems = async (req: express.Request, res: express.Response): Promise<void> => {
  const client: RedisClient = getClient();
  try {
      const productReq: string = req.header("X-PRODUCT") ?? '';

      let product: string | undefined = PRODUCT_LIST.includes(productReq) ? productReq : undefined;

      if (!product) {
      res
        .status(404)
        .send(`The requested product ${productReq} does not exist.`);
      } else if (product) {
        // Get product's stored hash if available
        // const result: string | null = await getResult(listString);
        const result: string | null =
          NODE_ENV === "test"
            ? await getResult(`${product}_test`)
            : await getResult(product);
        const productData: ProductItemObject | undefined = (result) ? JSON.parse(result) : undefined;

        let resValue = {};

        if (!productData) {
          const id = "id";
          // If no stored hash, get it from the DB
          const queryString: string = format("SELECT * FROM %I ORDER BY %I", product, id);

          const productQuery: QueryResult = await query(queryString);

          resValue[product] = productQuery.rows;

          // Handle different cache timers
          const cache: number = NODE_ENV === "test" ? TEST_CACHE_TIMER : CACHE_TIMER;

          // Add _test to product
          if (NODE_ENV === "test") product = `${product}_test`;

          // Save object to redis as a hash
          client.set(product, JSON.stringify(resValue), "EX", cache);
        } else {
          // If there is a hash
          if (NODE_ENV === "test") {
            resValue = Object.keys(productData).reduce((acc, curr) => {
              acc[`${curr}_test`] = productData[curr];
              return acc;
            }, {});

          } else {
            resValue = productData;
          }
        }
        res.json(resValue);
      }






  } catch (err) {
    console.log("getProduct failed!");
    console.log(err);
  }
};

export default getProductItems;
