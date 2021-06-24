import format from "pg-format";
import { QueryResult } from "pg";
import { RedisClient } from "redis";
import { getClient } from "./redis-client";
import query from "../db/query";
import { ProductItemRaw } from "../types";
import { NODE_ENV } from "./constants";

const evaluateProductItem = async (
  product: string,
  item: ProductItemRaw,
): Promise<void> => {
  const client: RedisClient = await getClient();

  try {
    // Check if the row exists in the DB
    const checkIfRowExists: string = format(
      "SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)",
      product,
      "id",
      item.id,
    );
    const result: QueryResult = await query(checkIfRowExists);

    if (!result.rows[0].exists) {
      // If it does not exist in the DB, append to redis key tracking ids for insertion
      const productInserts: string = (NODE_ENV === "test")
        ? `${product}-inserts_test`
        : `${product}-inserts`;
      client.append(
        productInserts,
        `${item.id},`,
      );
    } else {
      // If it does exist in the DB, append to redis key to check if item needs updating
      const productUpdates: string = (NODE_ENV === "test")
        ? `${product}-updates_test`
        : `${product}-updates`;
      client.append(
        productUpdates,
        `${item.id},`,
      );
    }
  } catch (err) {
    console.log("Unable to evaluate", product, item, err);
    evaluateProductItem(product, item);
  }
};

export default evaluateProductItem;
