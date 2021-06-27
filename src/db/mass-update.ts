import format from "pg-format";
import evalIfUpdateNeeded from "./eval-if-update-needed";
import { getResult } from "../shared/redis-client";
import processColors from "../shared/process-colors";
import query from "./query";
import {
  ProductRedisHash,
  ProductItemRaw,
} from "../types";
import { NODE_ENV } from "../shared/constants";

const massUpdate = async (product: string): Promise<void> => {
  try {
    let formatString = "UPDATE %I SET ";
    const caseString = "%I = CASE";

    let typeCase = `${caseString}`;
    let typeArray: string[] = [];
    const whereTypeArray: string[] = [];
    let whereTypeString = "";

    let nameCase = `${caseString}`;
    let nameArray: string[] = [];
    const whereNameArray: string[] = [];
    let whereNameString = "";

    let colorCase = `${caseString}`;
    let colorArray: string[] = [];
    const whereColorArray: string[] = [];
    let whereColorString = "";

    let priceCase = `${caseString}`;
    let priceArray: string[] = [];
    const wherePriceArray: string[] = [];
    let wherePriceString = "";

    let manufacturerCase = `${caseString}`;
    let manufacturerArray: string[] = [];
    const whereManufacturerArray: string[] = [];
    let whereManufactererString = "";

    const whenThenString = " WHEN %I = %L THEN %L";
    const endString = " END, ";
    let whereString = " WHERE %I IN (";
    let whereArray: string[] = ["id"];
    let formatArray: string[] = [product];

    // Get product redis hash data
    const productName: string = (NODE_ENV === "test")
      ? `${product}_test`
      : product;
    const productResult: string | null = await getResult(productName);
    const productData: ProductRedisHash | undefined = productResult
      ? JSON.parse(productResult)
      : undefined;

    // Get from redis ids of all product rows that should be updated
    const productUpdates: string = (NODE_ENV === "test")
      ? `${product}-updates_test`
      : `${product}-updates`;
    let updatesData: string | null = await getResult(productUpdates);

    if (updatesData && productData) {
      // Array of raw product data
      const productArray: ProductItemRaw[] = productData[productName];

      // Remove trailing comma on string list of update ids
      updatesData = updatesData.slice(0, updatesData.length - 1);
      const updateIdArray: string[] = updatesData.split(",");

      updateIdArray.forEach((updateId, index) => {
        // Find item data in the productArray
        const item: ProductItemRaw | undefined = productArray.find(({ id }) => id === updateId);
        if (item) {
          const result = evalIfUpdateNeeded(productName, item);
          result.then((valuesToUpdate) => {
            if (valuesToUpdate.length) {
              if (valuesToUpdate.includes("t")) {
                if (!formatArray.includes("type")) {
                  formatArray.push("type");
                }
                typeCase += whenThenString;
                typeArray = typeArray.concat(["id", item.id, item.type]);
                whereTypeString += "%L, ";
                whereTypeArray.push(item.id);
              }
              if (valuesToUpdate.includes("n")) {
                if (!formatArray.includes("name")) {
                  formatArray.push("name");
                }
                nameCase += whenThenString;
                nameArray = nameArray.concat(["id", item.id, item.name]);
                whereNameString += "%L, ";
                whereNameArray.push(item.id);
              }
              if (valuesToUpdate.includes("c")) {
                if (!formatArray.includes("color")) {
                  formatArray.push("color");
                }
                colorCase += whenThenString;
                colorArray = colorArray.concat(["id", item.id, processColors(item.color)]);
                whereColorString += "%L, ";
                whereColorArray.push(item.id);
              }
              if (valuesToUpdate.includes("p")) {
                if (!formatArray.includes("price")) {
                  formatArray.push("price");
                }
                priceCase += whenThenString;
                priceArray = priceArray.concat(["id", item.id, item.price.toString()]);
                wherePriceString += "%L, ";
                wherePriceArray.push(item.id);
              }
              if (valuesToUpdate.includes("m")) {
                if (!formatArray.includes("manufacturer")) {
                  formatArray.push("manufacturer");
                }
                manufacturerCase += whenThenString;
                manufacturerArray = manufacturerArray.concat(["id", item.id, item.manufacturer]);
                whereManufactererString += "%L, ";
                whereManufacturerArray.push(item.id);
              }
            }
            // Assembly
            if (index === updateIdArray.length - 1) {
              // When all update ids eval'd then
              if (typeCase.length > 10 && typeArray.length) {
                // If typeCase had strings concatenated, then close it out
                typeCase += endString;
                // Add typeArray values to formatArray
                formatArray = formatArray.concat(typeArray);
                whereArray = whereArray.concat(whereTypeArray);
                // Assemble string
                formatString += typeCase;
                whereString += whereTypeString;
              }
              if (nameCase.length > 10 && nameArray.length) {
                // If typeCase had strings concatenated, then close it out
                nameCase += endString;
                // Add nameArray values to formatArray
                formatArray = formatArray.concat(nameArray);
                whereArray = whereArray.concat(whereNameArray);
                // Assemble string
                formatString += nameCase;
                whereString += whereNameString;
              }
              if (colorCase.length > 10 && colorArray.length) {
                // If colorCase had strings concatenated, then close it out
                colorCase += endString;
                // Add colorArray values to formatArray
                formatArray = formatArray.concat(colorArray);
                whereArray = whereArray.concat(whereColorArray);
                // Assemble string
                formatString += colorCase;
                whereString += whereColorString;
              }
              if (priceCase.length > 10 && priceArray.length) {
                // If priceCase had strings concatenated, then close it out
                priceCase += endString;
                // Add priceArray values to formatArray
                formatArray = formatArray.concat(priceArray);
                whereArray = whereArray.concat(wherePriceArray);
                // Assemble string
                formatString += priceCase;
                whereString += wherePriceString;
              }
              if (manufacturerCase.length > 10 && manufacturerArray.length) {
                // If manufacturerCase had strings concatenated, then close it out
                manufacturerCase += endString;
                // Add manufacturerArray values to formatArray
                formatArray = formatArray.concat(manufacturerArray);
                whereArray = whereArray.concat(whereManufacturerArray);
                // Assemble string
                formatString += manufacturerCase;
                whereString += whereManufactererString;
              }
              // Trim trailing comma
              formatString = formatString.slice(0, formatString.length - 2); // From final end
              whereString = whereString.slice(0, whereString.length - 2); // From final id

              // Combine it all
              formatString = `${formatString}${whereString})`; // Adds closing parenthesis
              formatArray = formatArray.concat(whereArray);
              // Format query
              const updateQuery: string = format.withArray(
                formatString,
                formatArray,
              );
              // Issue query
              query(updateQuery);
            }
          });
        }
      });
    }
  } catch (err) {
    massUpdate(product);
    console.log("Mass Update failed!", err);
  }
};

export default massUpdate;
