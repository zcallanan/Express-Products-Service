import { QueryResult } from "pg";
import format from "pg-format";
import query from "./query";
import { getResult } from "../shared/redis-client";
import { ManAPIRes } from "../types";

const updateAvailability = async (
  manufacturers: string[],
  product: string,
): Promise<void> => {
  // Keep DB in sync with latest API fetch
  try {
    const productsQuery: string = format(
      "SELECT %I, %I FROM %I",
      "id",
      "availability",
      product,
    );

    const tableIDs: QueryResult = await query(productsQuery);
    let datapayload: string;
    let ind: number;
    let availability: string;
    let i = 0;
    let count = 0;
    let n = 0;
    let startString = "UPDATE %I SET %I = CASE "; // product, "availability", "id"
    const whenThenString = "WHEN %I = %L THEN %L "; // value.id.toLowerCase(), availability
    const closingString = " END WHERE %I IN ("; // "id"
    const whenThenArray: string[] = [];
    const idArray: string[] = [];
    let phSumString = "";
    const placeholderString = " %L, "; // value.id.toLowerCase()
    const formatArray = [product, "availability"];

    manufacturers.forEach((manufacturer) => {
      const promiseResult: Promise<string | null> = getResult(manufacturer);
      promiseResult.then((result) => {
        const manufacturerData: ManAPIRes[] | undefined = result
          ? JSON.parse(result)
          : undefined;
        if (manufacturerData) {
          if (manufacturer === manufacturers[manufacturers.length - 1]) {
            // For the final manufacturer, count # of product rows
            manufacturerData[manufacturer].forEach((value) => {
              ind = tableIDs.rows.findIndex((x) => x.id === value.id.toLowerCase());
              if (ind !== -1) {
                count += 1;
              }
            });
          }
          manufacturerData[manufacturer].forEach((value) => {
            // Each value found in manufacturer's availability data
            // ind is the id in the product table
            ind = tableIDs.rows.findIndex((x) => x.id === value.id.toLowerCase());
            if (ind !== -1) {
              if (manufacturer === manufacturers[manufacturers.length - 1]) {
                // Increment n to determine when to update
                n += 1;
              }
              // ind equals -1 if id not found in data response (product records)
              datapayload = value.DATAPAYLOAD.match(
                /<INSTOCKVALUE>(.*)<\/INSTOCKVALUE>/,
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
                i += 1;
                startString += whenThenString;
                whenThenArray.push("id");
                whenThenArray.push(value.id.toLowerCase());
                idArray.push(value.id.toLowerCase());
                whenThenArray.push(availability);
                phSumString += placeholderString;
              }
              // For the last manufacturer, when n is equal to count, then trigger update
              if (manufacturer === manufacturers[manufacturers.length - 1]
                && count === n
                && i > 0
              ) {
                const endString = `${closingString} ${phSumString})`;
                const merged1: string[] = formatArray.concat(whenThenArray);
                merged1.push("id");
                const merged2 = merged1.concat(idArray);
                startString += endString;
                // Remove extra comma
                startString = `${startString.slice(0, startString.length - 3)})`;

                const availabilityUpdate: string = format.withArray(
                  startString,
                  merged2,
                );
                query(availabilityUpdate);
                console.log(`Total availability updates for ${product}: ${i}`);
              }
            }
          });
        }
      });
    });
  } catch (err) {
    console.log("Failed to update availability for", product, err);
  }
};

export default updateAvailability;
