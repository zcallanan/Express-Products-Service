import format from "pg-format";
import { QueryResult } from "pg";
import { RedisClient } from "redis";
import { getClient, getResult } from "../shared/redis-client";
import query from "./query";
import { NODE_ENV } from "../shared/constants";
import { ProductRedisHash } from "../types";

const evalInsertUpdate = async (product: string): Promise<void> => {
  const client: RedisClient = await getClient();

  try {
    const productTally: string = (NODE_ENV === "test")
      ? `${product}-tally_test`
      : `${product}-tally`;

    // Get product redis hash data
    const productName: string = (NODE_ENV === "test")
      ? `${product}_test`
      : product;
    const productResult: string | null = await getResult(productName);
    const productData: ProductRedisHash | undefined = productResult
      ? JSON.parse(productResult)
      : undefined;

    // For first 3333 product IDs, if not in DB >>> insert, else eval for update
    if (productData) {
      const queryString: string = format("SELECT %I FROM %I", "id", productName);
      const tableIdArray: QueryResult = await query(queryString);
      if (tableIdArray) {
        productData[productName].forEach((item, index) => {
          if (index < 3333) {
            if (!tableIdArray.rows.find(({ id }) => id === item.id)) {
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

            // Tally as each row is examined. When this reaches 3333 the eval is complete
            // Then redis subscriber takes over and executes query fns
            client.append(
              productTally,
              `${item.id},`,
            );
          }
        });
      }
    }
  } catch (err) {
    evalInsertUpdate(product);
    console.log(`Failed to evaluate ${product}`, err);
  }
};

export default evalInsertUpdate;
