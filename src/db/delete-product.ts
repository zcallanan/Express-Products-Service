import query from "./query";
import format from "pg-format";
import { QueryResult } from "pg";

const deleteProduct = async (
  product: string,
  productIDs: string[]
): Promise<QueryResult> => {
  // Keep DB in sync with latest API fetch
  try {
    const deleteSelect: string = format("SELECT %I FROM %I", "id", product);
    const tableIDs: QueryResult = await query(deleteSelect);
    tableIDs.rows.forEach((row) => {
      if (!productIDs.includes(row.id)) {
        // Delete the record
        const deleteQuery: string = format(
          "DELETE FROM %I WHERE %I = %L",
          product,
          "id",
          row.id
        );
        query(deleteQuery);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

export default deleteProduct;
