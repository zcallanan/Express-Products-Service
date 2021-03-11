import query from "./query";
import updateProduct from "../db/update-product";
import format from "pg-format";
import { QueryResult } from "pg";
import { ProductItemProcessed } from "../types";

const insertProduct = async (
  product: string,
  item: ProductItemProcessed,
  colors: string
): Promise<QueryResult> => {
  try {
    // Check status
    const insertSelect: string = format(
      "SELECT EXISTS(SELECT 1 FROM %I WHERE %I = %L)",
      product,
      "id",
      item.id
    );
    const result: QueryResult = await query(insertSelect);
    // If it does not exist, insert

    if (!result.rows[0].exists) {
      const insertQuery: string = format(
        "INSERT INTO %I (%I, %I, %I, %I, %I, %I, %I) \
        VALUES (%L, %L, %L, %L, %L, %L, %L)",
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
        "Availability Unknown"
      );
      query(insertQuery);
    } else {
      // If it does exist, check if it needs to be updated
      updateProduct(product, item, colors);
    }
  } catch (err) {
    console.log(err);
  }
};

export default insertProduct;
