import format from "pg-format";
import { getResult } from "../shared/redis-client";
import processColors from "../shared/process-colors";
import query from "./query";
import {
  ProductRedisHash,
  ProductItemRaw,
} from "../types";
import { NODE_ENV } from "../shared/constants";

const massInsert = async (product: string): Promise<void> => {
  try {
    let formatString = "INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) VALUES";
    const valuesString = " (%L, %L, %L, %L, %L, %L, %L),";
    let formatArray: string[] = [
      product,
      "id",
      "type",
      "name",
      "color",
      "price",
      "manufacturer",
      "availability",
    ];

    // Get product redis hash data
    const productName: string = (NODE_ENV === "test")
      ? `${product}_test`
      : product;
    const productResult: string | null = await getResult(productName);
    const productData: ProductRedisHash | undefined = productResult
      ? JSON.parse(productResult)
      : undefined;
    const productInserts: string = (NODE_ENV === "test")
      ? `${product}-inserts_test`
      : `${product}-inserts`;
    let insertsData: string | null = await getResult(productInserts);
    if (insertsData && productData) {
      const productArray: ProductItemRaw[] = productData[productName];
      insertsData = insertsData.slice(0, insertsData.length - 1);
      const insertIdArray: string[] = insertsData.split(",");
      insertIdArray.forEach((insertId, index) => {
        // Find item data in the productArray
        const item: ProductItemRaw | undefined = productArray.find(({ id }) => id === insertId);
        if (item) {
          const valuesArray: string[] = [
            item.id,
            item.type,
            item.name,
            processColors(item.color),
            item.price.toString(),
            item.manufacturer,
            "Availability Unknown",
          ];
          formatString += valuesString;
          formatArray = formatArray.concat(valuesArray);
        }
        if (index === insertIdArray.length - 1) {
          // Remove extra comma
          formatString = formatString.slice(0, formatString.length - 1);
          // Format query
          const insertQuery: string = format.withArray(
            formatString,
            formatArray,
          );
          // Issue query
          query(insertQuery);
        }
      });
    }
  } catch (err) {
    massInsert(product);
    console.log("Mass Insert failed!", err);
  }
};

export default massInsert;
