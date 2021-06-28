import format from "pg-format";
import { QueryResult } from "pg";
import { RedisClient } from "redis";
import query from "./query";
import { getResult, getClient } from "../shared/redis-client";
import { NODE_ENV } from "../shared/constants";
import { ProductRedisHash } from "../types";

const evalToDelete = async (product: string): Promise<void> => {
  const client: RedisClient = await getClient();
  try {
    // Get product redis hash data
    const productName: string = (NODE_ENV === "test")
      ? `${product}_test`
      : product;
    const productResult: string | null = await getResult(productName);
    const productData: ProductRedisHash | undefined = productResult
      ? JSON.parse(productResult)
      : undefined;

    if (productData) {
      // Get all product IDs from DB
      const queryString: string = format("SELECT %I FROM %I", "id", product);
      const tableIDs: QueryResult = await query(queryString);

      tableIDs.rows.forEach((row) => {
        // If an index is NOT found in productData for the DB id, then ind = -1
        const ind: number = productData[product]
          .findIndex((item) => item.id.toLowerCase() === row.id);

        // Table id was not found in product data, ind is -1, so delete the row from table
        if (ind === -1) {
          const productDeletes: string = (NODE_ENV === "test")
            ? `${product}-deletes_test`
            : `${product}-deletes`;
          client.append(
            productDeletes,
            `${row.id},`,
          );
        }
      });
    }
  } catch (err) {
    evalToDelete(product);
    console.log(`Failed to evaluate ${product} for deletion.`, err);
  }
};

export default evalToDelete;
