import format from "pg-format";
import { QueryResult } from "pg";
import { RedisClient } from "redis";
import { getResult, getClient } from "../shared/redis-client";
import query from "./query";
import updateProduct from "./update-product";
import { ProductItemRaw } from "../types";
import {
  CACHE_TIMER,
  TEST_CACHE_TIMER,
} from "../shared/constants";

const insertProduct = async (
  product: string,
  item: ProductItemRaw,
  colors: string,
): Promise<void> => {
  const client: RedisClient = await getClient();

  try {
    // Check status
    const insertSelect: string = format(
      "SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)",
      product,
      "id",
      item.id,
    );
    const result: QueryResult = await query(insertSelect);
    // If it does not exist in db, insert
    if (!result.rows[0].exists) {
      const insertQuery: string = format(
        "INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) VALUES (%L, %L, %L, %L, %L, %L, %L)",
        product,
        "id",
        "type",
        "name",
        "color",
        "price",
        "manufacturer",
        "availability",
        item.id,
        item.type,
        item.name,
        colors,
        item.price,
        item.manufacturer,
        "Availability Unknown",
      );
      query(insertQuery);
      const productInserts: string = (NODE_ENV === "test")
        ? `${product}-inserts_test`
        : `${product}-inserts`;
      client.append(
        productInserts,
        `${item.id},`,
      );
    } else {
      const productUpdates: string = (NODE_ENV === "test")
        ? `${product}-updates_test`
        : `${product}-updates`;
      client.append(
        productUpdates,
        `${item.id},`,
      );
      // If it does exist, check if it needs to be updated
      updateProduct(product, item, colors);
    }
  } catch (err) {
    console.log("Unable to insert", product, item, err);
  }
};

export default insertProduct;
