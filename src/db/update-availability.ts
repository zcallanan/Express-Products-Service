import query from "./query";
import format from "pg-format";
import { getResult } from "../shared/redis-client";
import { QueryResult } from "pg";

const updateAvailability = async (
  manufacturers: Array<string>,
  product: string
): Promise<QueryResult> => {
  // Keep DB in sync with latest API fetch
  try {
    const productsQuery: string = format(
      "SELECT %I, %I FROM %I",
      "id",
      "availability",
      product
    );

    const tableIDs: QueryResult = await query(productsQuery);
    let datapayload: string;
    let ind: number;
    let availability: string;
    let i = 0;

    for (const manufacturer of manufacturers) {
      const result: string | null = await getResult(manufacturer);
      const manufacturerData: ArrayManufacturerItem | undefined = result
        ? JSON.parse(result)
        : undefined;
      if (manufacturerData) {
        manufacturerData[manufacturer].forEach((value) => {
          // Each value found in manufacturer's availability data
          ind = tableIDs.rows.findIndex((x) => x.id === value.id.toLowerCase());
          if (ind !== -1) {
            // ind equals -1 if id not found in data response (product records)
            datapayload = value.DATAPAYLOAD.match(
              /<INSTOCKVALUE>(.*)<\/INSTOCKVALUE>/
            );
            if (datapayload) {
              if (datapayload[1] === "OUTOFSTOCK") {
                availability = "Out of Stock";
              } else if (datapayload[1] === "INSTOCK") {
                availability = "In Stock";
              } else if (datapayload[1] === "LESSTHAN10") {
                availability = "Less Than 10";
              }
            }

            // If API response's availability differs from what is in the DB
            if (availability !== tableIDs.rows[ind].availability) {
              i++;
              const availabilityUpdate: string = format(
                "UPDATE %I SET %I = %L WHERE %I = %L",
                product,
                "availability",
                availability,
                "id",
                value.id.toLowerCase()
              );
              query(availabilityUpdate);
            }
          }
        });
      }
    }
    console.log(`Total availability updates for ${product}: ${i}`);
  } catch (err) {
    console.log(err);
  }
};

export default updateAvailability;
