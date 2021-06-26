import format from "pg-format";
import { getResult } from "../shared/redis-client";
import query from "./query";
import { NODE_ENV } from "../shared/constants";

const massDelete = async (product: string): Promise<void> => {
  try {
    // Get from redis ids of all product rows that should be deleted
    const productDeletes: string = (NODE_ENV === "test")
      ? `${product}-deletes_test`
      : `${product}-deletes`;
    const productName: string = (NODE_ENV === "test")
      ? `${product}_test`
      : product;
    let deletesData: string | null = await getResult(productDeletes);
    let formatString = "DELETE FROM %I WHERE";
    let formatArray: string[] = [productName];

    if (deletesData) {
      // Remove trailing comma
      deletesData = deletesData.slice(0, deletesData.length - 1);
      // Convert to array
      const deletesArray: string[] = deletesData.split(",");
      deletesArray.forEach((id, index) => {
        formatString += (index === 0) ? " %I = %L" : " OR %I = %L";
        formatArray = formatArray.concat(["id", id]);

        if (index === deletesArray.length - 1) {
          // SQL query
          const deleteQuery: string = format.withArray(
            formatString,
            formatArray,
          );
          console.log(deleteQuery);
          // Issue query
          query(deleteQuery);
        }
      });
    }
  } catch (err) {
    console.log(`Failure to delete ${product} data`);
    massDelete(product);
  }
};

export default massDelete;
