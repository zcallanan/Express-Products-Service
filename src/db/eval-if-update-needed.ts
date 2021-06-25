import format from "pg-format";
import { QueryResult } from "pg";
import processColors from "../shared/process-colors";
import query from "./query";
import { ProductItemRaw } from "../types";

const evalIfUpdateNeeded = async (product: string, item: ProductItemRaw): Promise<string[]> => {
  const stringArray: string[] = [];
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
    const itemValuesInDb: string[] = recordValues.rows[0].row.split(",");

    if (item.type !== itemValuesInDb[0].replace(/"|\(+/g, "")) {
      stringArray.push("t");
    }

    if (item.name !== itemValuesInDb[1].replace(/["]+/g, "")) {
      stringArray.push("n");
    }

    let recordColors: string = itemValuesInDb[2].replace(/["]+/g, "");
    if (itemValuesInDb.length === 6) {
      // If there are two colors
      recordColors = `${recordColors}, ${itemValuesInDb[3].replace(/["]+/g, "")}`;
    }

    if (processColors(item.color) !== recordColors) {
      stringArray.push("c");
    }

    if (item.price !== Number(itemValuesInDb[itemValuesInDb.length - 2])) {
      stringArray.push("p");
    }

    if (item.manufacturer !== itemValuesInDb[itemValuesInDb.length - 1].replace(/"|\)+/g, "")) {
      stringArray.push("m");
    }
  } catch (err) {
    console.log(`Failed to retrieve record data for ${item.id}`);
  }
  return stringArray;
};

export default evalIfUpdateNeeded;
