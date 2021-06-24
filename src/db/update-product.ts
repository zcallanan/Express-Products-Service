import format from "pg-format";
import { QueryResult } from "pg";
import query from "./query";
import { StringList, ProductItemRaw } from "../types";

const updateProduct = async (
  product: string,
  item: ProductItemRaw,
  colors: string,
): Promise<void> => {
  try {
    const updateSelect: string = format(
      "SELECT (%I, %I, %I, %I, %I) FROM %I WHERE %I = %L",
      "type",
      "name",
      "color",
      "price",
      "manufacturer",
      product,
      "id",
      item.id,
    );
    const recordValues: QueryResult = await query(updateSelect);
    // let startString = "UPDATE %I SET"; // product
    // const caseString = "%I = CASE "; // type|name|colors|price|manufacturer
    // const whenThenString = "WHEN %I = %L THEN %L "; // "id", item.id, item.(type|name|colors|price|manufacturer)
    // const whenThenArray: string[] = [];
    // const endString = "END,";
    // const whereString = " WHERE %I IN ("; // "id"
    // let phSumString = "";
    // const placeholderString = " %L, "; // value.id.toLowerCase()
    // const placeholderArray: string[] = [];
    // const formatArray = [product];

    /*

    UPDATE product SET
      type = CASE
        WHEN id = item.id THEN item.type WHEN id = item.id THEN item.type...
      END,
      name = CASE
        WHEN id = item.id THEN item.name WHEN id = item.id THEN item.name...
      END,
      color = CASE
        WHEN id = item.id THEN colors WHEN id = item.id THEN colors...
      END,
      price = CASE
        WHEN id = item.id THEN item.price WHEN id = item.id THEN item.price...
      END,
      manufacturer = CASE
        WHEN id = item.id THEN item.manufacturer WHEN id = item.id THEN item.manufacturer...
      END
      WHERE id IN (item.id, item.id, item.id, ... item.id)

    */

    // Split to get each column value
    const array: string[] = recordValues.rows[0].row.split(",");

    const updateObject: StringList = {
      array: [],
    };

    if (item.type !== array[0].replace(/"|\(+/g, "")) {
      // Update type in DB
      const cond1: string = format("%I = %L", "type", item.type);
      updateObject.array.push(cond1);
    }

    if (item.name !== array[1].replace(/["]+/g, "")) {
      // Update name in DB
      const cond2: string = format("%I = %L", "name", item.name);
      updateObject.array.push(cond2);
    }
    let recordColors: string = array[2].replace(/["]+/g, "");
    if (array.length === 6) {
      // If there are two colors
      recordColors = `${recordColors}, ${array[3].replace(/["]+/g, "")}`;
    }
    if (colors !== recordColors) {
      // Update color in DB
      const cond3: string = format("%I = %L", "color", colors);
      updateObject.array.push(cond3);
    }
    if (item.price !== Number(array[array.length - 2])) {
      // Update price in DB
      const cond4: string = format("%I = %L", "price", item.price);
      updateObject.array.push(cond4);
    }

    if (item.manufacturer !== array[array.length - 1].replace(/"|\)+/g, "")) {
      // Update manufacturer in DB
      const cond5: string = format(
        "%I = %L",
        "manufacturer",
        item.manufacturer,
      );
      updateObject.array.push(cond5);
    }

    if (updateObject.array.length) {
      const condString: string = updateObject.array.join(", ");
      const updateQuery: string = format(
        "UPDATE %I SET %s WHERE %I = %L",
        product,
        condString,
        "id",
        item.id,
      );
      query(updateQuery);
    }
  } catch (err) {
    console.log("Failed to update", product, item, err);
  }
};

export default updateProduct;
